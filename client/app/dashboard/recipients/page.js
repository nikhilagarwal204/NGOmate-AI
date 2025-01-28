"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';

const DynamicTableComponent = ({ title, endpoint, description }) => {
//   const [data, setData] = useState([]);
//   const [fields, setFields] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch fields structure
//         const fieldsResponse = await fetch(`${endpoint}/fields`);
//         const fieldsData = await fieldsResponse.json();
//         setFields(fieldsData);

//         // Fetch table data
//         const dataResponse = await fetch(endpoint);
//         const tableData = await dataResponse.json();
//         setData(tableData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [endpoint]);

const sampleFields = [
  { key: 'name', label: 'Recipient Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' }
];

  const sampleData = [
    {
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '+1 (555) 123-4567',
      priority: 'High',
      status: 'Pending',
    },
    {
      name: 'Robert Chen',
      email: 'robert.c@email.com',
      phone: '+1 (555) 234-5678',
      priority: 'Medium',
      status: 'Active',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 345-6789',
      priority: 'Low',
      status: 'Active',
    },
    {
      name: 'Ahmed Hassan',
      email: 'ahmed.h@email.com',
      phone: '+1 (555) 456-7890',
      priority: 'High',
      status: 'Urgent',
    }
  ];

  const [data, setData] = useState(sampleData);
  const [fields, setFields] = useState(sampleFields);
  const [isLoading, setIsLoading] = useState(false);

  const getPriorityColorClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full';
      case 'medium':
        return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full';
      case 'high':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Recipients Details {title}</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {fields.map((field) => (
                      <th 
                        key={field.key}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                      >
                        {field.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right">Additional Info</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr 
                      key={index}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {fields.map((field) => (
                        <td 
                          key={field.key}
                          className="px-4 py-3 text-sm text-gray-900"
                        >
                          {field.key === 'priority' ? (
                            <span className={getPriorityColorClass(row[field.key])}>
                              {row[field.key]}
                            </span>
                          ) : (
                            row[field.key]
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          Click to know
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicTableComponent;
