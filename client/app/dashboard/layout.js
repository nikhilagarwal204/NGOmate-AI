"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Key, Users, HandHeart } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Templates', path: '/dashboard/templates', icon: FileText },
    { name: 'API Configuration', path: '/dashboard/api-config', icon: Key },
    { name: 'Donor Management', path: '/dashboard/donors', icon: HandHeart },
    { name: 'Recipients', path: '/dashboard/recipients', icon: Users },
  ];

  // Redirect to templates if on root dashboard path
  React.useEffect(() => {
    if (pathname === '/dashboard') {
      router.push('/dashboard/templates');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">NGO Dashboard</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">NG</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">NGO Name</p>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
