"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, CreditCard, ArrowLeft, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AssistanceRequestForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        medicalCondition: '',
        assistanceRequired: '',
        documents: null
    });

    const assistanceTypes = [
        { value: 'surgery', label: 'Surgery' },
        { value: 'treatment', label: 'Medical Treatment' },
        { value: 'medication', label: 'Medication' },
        { value: 'other', label: 'Other Assistance' }
    ];

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await fetch('/api/assistance-request', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer abcdefghijk'
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            router.push('/request-submitted');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">Medical Assistance</span>
                    </div>
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Request Medical Assistance</CardTitle>
                        <CardDescription>
                            Please provide your details and required documentation for medical support
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-3">
                                <Label>Personal Information</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        name="email"
                                        placeholder="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        name="phone"
                                        placeholder="Phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            {/* Assistance Type Selection */}
                            <div className="space-y-3">
                                <Label>Type of Assistance Needed</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {assistanceTypes.map((type) => (
                                        <Button
                                            key={type.value}
                                            type="button"
                                            variant={formData.assistanceRequired === type.value ? "default" : "outline"}
                                            className="w-full"
                                            onClick={() => setFormData(prev => ({ ...prev, assistanceRequired: type.value }))}
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Medical Condition */}
                            <div className="space-y-3">
                                <Label>Medical Condition Details</Label>
                                <Textarea
                                    name="medicalCondition"
                                    placeholder="Please describe your medical condition"
                                    value={formData.medicalCondition}
                                    onChange={handleInputChange}
                                    className="min-h-[100px]"
                                />
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-3">
                                <Label>Supporting Documents</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <input
                                        type="file"
                                        name="documents"
                                        id="documents"
                                        className="hidden"
                                        onChange={handleInputChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <label htmlFor="documents" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-600">
                                            Upload medical reports, prescriptions, or cost estimates
                                        </span>
                                        <span className="mt-1 text-xs text-gray-400">
                                            (PDF, JPG, PNG up to 5MB)
                                        </span>
                                    </label>
                                </div>
                                {formData.documents && (
                                    <p className="text-sm text-green-600">
                                        File selected: {formData.documents.name}
                                    </p>
                                )}
                            </div>

                        </form>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AssistanceRequestForm;