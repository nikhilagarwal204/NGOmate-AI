"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Key, Link } from 'lucide-react';

const APIConfigComponent = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const apiKeys = [
    { label: 'Primary API Key', value: 'your-api-key-here' },
    { label: 'Secondary API Key', value: 'your-secondary-key-here' }
  ];

  const apiEndpoints = [
    { name: 'Donor API', endpoint: 'https://api.example.com/donors' },
    { name: 'Recipients API', endpoint: 'https://api.example.com/recipients' },
    { name: 'Volunteer API', endpoint: 'https://api.example.com/volunteer' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Configuration</h1>
        <p className="text-gray-500">Manage your API keys and endpoints</p>
      </div>

      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Keys</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((key, index) => (
            <div key={index} className="space-y-2">
              <Label>{key.label}</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="password" 
                  value={key.value} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(key.value)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Endpoints Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="w-5 h-5" />
            <span>API Endpoints</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiEndpoints.map((api, index) => (
            <div key={index} className="space-y-2">
              <Label>{api.name}</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  value={api.endpoint} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(api.endpoint)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConfigComponent;