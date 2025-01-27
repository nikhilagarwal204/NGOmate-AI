"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Globe, FileText, Users, HandHeart, HeartHandshake, Mail } from 'lucide-react';

const NGOOnboardingForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ngoName: '',
    email: '',
    description: '',
    website: '',
    apis: {
      donor: false,
      recipients: false,
      volunteer: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Onboarding successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold text-blue-900">Welcome to NGOmate</CardTitle>
          </div>
          <CardDescription>
           NGOmate is here, to make your life easier. Let's get started by setting up your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ngoName" className="text-sm font-medium">
                Organization Name
              </Label>
              <div className="relative">
                <Input
                  id="ngoName"
                  placeholder="Enter your NGO's name"
                  className="pl-10"
                  value={formData.ngoName}
                  onChange={(e) => setFormData({...formData, ngoName: e.target.value})}
                />
                <Building2 className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mission
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Tell us about your organization's mission and work..."
                  className="min-h-[100px] pl-10"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <FileText className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="ngo@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium">
                Website
              </Label>
              <div className="relative">
                <Input
                  id="website"
                  placeholder="https://your-ngo.org"
                  className="pl-10"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
                <Globe className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Required APIs</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="donor"
                    checked={formData.apis.donor}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData,
                        apis: {...formData.apis, donor: checked}
                      })
                    }
                  />
                  <Label htmlFor="donor" className="flex items-center space-x-2">
                    <HandHeart className="w-4 h-4 text-blue-600" />
                    <span>Donor Management API</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recipients"
                    checked={formData.apis.recipients}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData,
                        apis: {...formData.apis, recipients: checked}
                      })
                    }
                  />
                  <Label htmlFor="recipients" className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Recipients API</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="volunteer"
                    checked={formData.apis.volunteer}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData,
                        apis: {...formData.apis, volunteer: checked}
                      })
                    }
                  />
                  <Label htmlFor="volunteer" className="flex items-center space-x-2">
                    <HeartHandshake className="w-4 h-4 text-blue-600" />
                    <span>Volunteer Management API</span>
                  </Label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Complete Onboarding
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NGOOnboardingForm;