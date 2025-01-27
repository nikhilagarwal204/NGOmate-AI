"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, CreditCard, ArrowLeft } from 'lucide-react';

const DonationForm = () => {
  const router = useRouter();
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const predefinedAmounts = [
    { value: '100', label: '$100' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: 'custom', label: 'Custom Amount' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer abcdefghijk'
        },
        body: JSON.stringify({
          amount: donationAmount === 'custom' ? document.querySelector('input[type="number"]').value : donationAmount,
          paymentMethod,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Donation failed');
      }

      const data = await response.json();
      router.push('/success'); // Redirect to success page
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process donation. Please try again.');
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
            <span className="text-2xl font-bold text-blue-600">Go Good</span>
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
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
            <CardDescription>
              Your contribution helps us provide medical care to those in need
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
              
              {/* Donation Amount Selection */}
              <div className="space-y-3">
                <Label>Select Donation Amount</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount.value}
                      type="button"
                      variant={donationAmount === amount.value ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setDonationAmount(amount.value)}
                    >
                      {amount.label}
                    </Button>
                  ))}
                </div>
                {donationAmount === 'custom' && (
                  <div className="mt-3">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="cursor-pointer">UPI Payment</Label>
                  </div>
                </RadioGroup>
              </div>

              
            </form>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Complete Donation'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DonationForm;