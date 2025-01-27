"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Users, Trophy, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NGOLandingPage = () => {
  const router = useRouter();

  const handleScroll = (elementId) => {
    document.querySelector(elementId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { number: '10K+', label: 'Lives Impacted', icon: Users },
    { number: '150+', label: 'Medical Camps', icon: Activity },
    { number: '5K+', label: 'Regular Donors', icon: Heart },
    { number: '95%', label: 'Success Rate', icon: Trophy },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-blue-600">Go Good</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => handleScroll('#about')}>
                About Us
              </Button>
              <Button variant="ghost" onClick={() => handleScroll('#impact')}>
                Our Impact
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => router.push('/dummy-ngo/donate')}
              >
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-blue-600 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Healing Lives</span>
                  <span className="block text-blue-200">Building Hope</span>
                </h1>
                <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join us in our mission to provide quality medical care to those in need. Every donation helps us reach more people and save more lives.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <Button 
                    className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => router.push('/dummy-ngo/receive-help')}
                  >
                    Need Help
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4">
                  <Icon className="w-8 h-8 mx-auto text-blue-600" />
                  <div className="mt-2 text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOLandingPage;