import json
import os
import uuid
from datetime import datetime
from typing import List

import openai
import uvicorn
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from google.cloud import storage
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(title="NGO Platform API")

# Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
GCS_BUCKET = os.getenv("GCS_BUCKET", "ngo-templates")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize clients
mongo_client = AsyncIOMotorClient(MONGODB_URL)
db = mongo_client.ngo_platform
storage_client = storage.Client()
bucket = storage_client.bucket(GCS_BUCKET)
openai.api_key = OPENAI_API_KEY


# Models
class NGO(BaseModel):
    name: str
    mission: str
    website: str
    contact_email: str


class DonorSubmission(BaseModel):
    ngo_id: str
    donation_details: dict  # Contains donation amount, purpose, donor info etc.


class RecipientSubmission(BaseModel):
    ngo_id: str
    assistance_request: dict  # Contains request details, personal info, needs etc.


# Helper Functions
async def generate_api_key() -> str:
    return f"ngo_{uuid.uuid4().hex}"


async def upload_to_gcs(file: bytes, filename: str) -> str:
    blob = bucket.blob(f"templates/{filename}")
    blob.upload_from_string(file)
    return blob.public_url


async def analyze_documents_with_ai(documents: List[str]) -> dict:
    # Combine documents into a single context
    doc_text = "\n".join(documents)

    response = await openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant analyzing assistance request documents and determining priority/severity.",
            },
            {
                "role": "user",
                "content": f"Analyze these documents and determine the severity (low/medium/high) and urgency based on the provided proof:\n{doc_text}",
            },
        ],
    )

    return {
        "severity": response.choices[0].message.content,
        "analysis": response.choices[0].message.content,
    }


async def generate_personalized_email(template_type: str, data: dict) -> str:
    prompt = f"Generate a personalized email for a {template_type} based on this information:\n{str(data)}"

    response = await openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant generating personalized emails for NGO communications.",
            },
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content


async def verify_api_key(api_key: str = Header(...)):
    ngo = await db.ngos.find_one({"api_key": api_key})
    if not ngo:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return ngo


# API Routes
@app.post("/onboarding")
async def onboard_ngo(ngo: NGO):
    # Generate API key
    api_key = await generate_api_key()

    # Store NGO data
    ngo_doc = ngo.dict()
    ngo_doc["api_key"] = api_key
    ngo_doc["created_at"] = datetime.utcnow()

    result = await db.ngos.insert_one(ngo_doc)

    return {
        "ngo_id": str(result.inserted_id),
        "api_key": api_key,
        "api_endpoints": {"donor": f"/api/v1/donor", "recipient": f"/api/v1/recipient"},
    }


@app.get("/apikeys/{ngo_id}")
async def get_api_keys(ngo_id: str):
    ngo = await db.ngos.find_one({"_id": ngo_id})
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    return {
        "api_key": ngo["api_key"],
        "endpoints": {"donor": f"/api/v1/donor", "recipient": f"/api/v1/recipient"},
    }


@app.post("/templates/{ngo_id}")
async def upload_templates(
    ngo_id: str,
    donor_template: UploadFile = File(...),
    recipient_template: UploadFile = File(...),
):
    # Upload templates to GCS
    donor_url = await upload_to_gcs(
        await donor_template.read(), f"{ngo_id}/donor_{donor_template.filename}"
    )

    recipient_url = await upload_to_gcs(
        await recipient_template.read(),
        f"{ngo_id}/recipient_{recipient_template.filename}",
    )

    # Update NGO document with template URLs and template types
    await db.ngos.update_one(
        {"_id": ngo_id},
        {
            "$set": {
                "templates": {
                    "donor": {"url": donor_url, "type": "donation_acknowledgment"},
                    "recipient": {"url": recipient_url, "type": "assistance_response"},
                }
            }
        },
    )

    return {"status": "Templates uploaded successfully"}


@app.post("/donor")
async def process_donor(
    submission: DonorSubmission, ngo: dict = Depends(verify_api_key)
):
    if submission.ngo_id != str(ngo["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized for this NGO")

    # Generate personalized email using NGO's donor template
    email_content = await generate_personalized_email(
        "donation_acknowledgment", submission.donation_details
    )

    # Store donor submission
    donor_doc = {
        "ngo_id": submission.ngo_id,
        "donation_details": submission.donation_details,
        "email_content": email_content,
        "created_at": datetime.utcnow(),
        "status": "processed",
    }

    await db.donors.insert_one(donor_doc)

    return {"status": "Donor submission processed successfully"}


@app.post("/recipient")
async def process_recipient(
    ngo_id: str = Form(...),
    assistance_request: str = Form(...),  # JSON string of request details
    supporting_document: UploadFile = File(...),
    ngo: dict = Depends(verify_api_key),
):
    if ngo_id != str(ngo["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized for this NGO")

    # Read and upload supporting document
    document_content = await supporting_document.read()
    document_url = await upload_to_gcs(
        document_content, f"{ngo_id}/documents/{supporting_document.filename}"
    )

    # Convert assistance_request from string to dict
    request_data = json.loads(assistance_request)

    # Convert document to text for analysis (you might need a PDF/Doc parser here)
    # For now, assuming it's a text file
    document_text = document_content.decode("utf-8")

    # Analyze supporting document with AI
    analysis = await analyze_documents_with_ai([document_text])

    # Generate personalized email using NGO's recipient template
    email_content = await generate_personalized_email(
        "assistance_response", {**request_data, "analysis": analysis}
    )

    # Store recipient submission
    recipient_doc = {
        "ngo_id": ngo_id,
        "assistance_request": request_data,
        "supporting_document_url": document_url,
        "analysis": analysis,
        "email_content": email_content,
        "created_at": datetime.utcnow(),
        "status": "processed",
    }

    await db.recipients.insert_one(recipient_doc)

    return {
        "status": "Recipient submission processed successfully",
        "severity": analysis["severity"],
        "document_url": document_url,
    }


@app.get("/donors/{ngo_id}")
async def get_donors(ngo_id: str, ngo: dict = Depends(verify_api_key)):
    if ngo_id != str(ngo["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized for this NGO")
    donors = await db.donors.find({"ngo_id": ngo_id}).to_list(length=100)
    return {"donors": donors}


@app.get("/recipients/{ngo_id}")
async def get_recipients(ngo_id: str, ngo: dict = Depends(verify_api_key)):
    if ngo_id != str(ngo["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized for this NGO")
    recipients = await db.recipients.find({"ngo_id": ngo_id}).to_list(length=100)
    return {"recipients": recipients}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
