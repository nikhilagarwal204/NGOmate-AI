"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Plus, FileText } from 'lucide-react';

const TemplatesComponent = () => {
  const [templates, setTemplates] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTemplateUpload = (file) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !templateName) {
      alert('Please select a file and enter a template name');
      return;
    }

    setIsUploading(true);
    
    // Create a new template object
    const newTemplate = {
      name: templateName,
      description: templateDescription,
      file: selectedFile,
      fileName: selectedFile.name,
      uploadDate: new Date().toLocaleDateString()
    };

    // Update templates array
    setTemplates([...templates, newTemplate]);
    
    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    setSelectedFile(null);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-gray-500">Manage your organization's document templates</p>
        </div>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-blue-50">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : 'Drag and drop your template here'}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? 'File selected' : 'or click to browse files'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleTemplateUpload(e.target.files[0])}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Template Name</Label>
              <Input 
                placeholder="Enter template name" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe the purpose of this template..." 
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload Template'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    File: {template.fileName} • Uploaded: {template.uploadDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesComponent;