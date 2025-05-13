import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Users, Calendar, Flag, DollarSign } from 'lucide-react';
import { mockUsers, mockEvents, mockTeams, mockPayments, mockRegistrations } from '../../utils/mockData';

// Mock data for charts
const mockRevenueData = [
  { month: 'Jan', amount: 2100 },
  { month: 'Feb', amount: 3200 },
  { month: 'Mar', amount: 4100 },
  { month: 'Apr', amount: 4800 },
  { month: 'May', amount: 3900 },
  { month: 'Jun', amount: 5200 },
];

const mockRegistrationData = [
  { month: 'Jan', count: 24 },
  { month: 'Feb', count: 32 },
  { month: 'Mar', count: 42 },
  { month: 'Apr', count: 38 },
  { month: 'May', count: 45 },
  { month: 'Jun', count: 52 },
];

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalTeams: 0,
    totalRevenue: 0,
    pendingRegistrations: 0,
  });

  useEffect(() => {
    // Calculate statistics from mock data
    const totalUsers = mockUsers.length;
    const totalEvents = mockEvents.length;
    const totalTeams = mockTeams.length;
    
    const totalRevenue = mockPayments.reduce((sum, payment) => {
      return sum + (payment.payment_status === 'completed' ? payment.amount : 0);
    }, 0);
    
    const pendingRegistrations = mockRegistrations.filter(
      reg => reg.registration_status === 'pending'
    ).length;

    setStats({
      totalUsers,
      totalEvents,
      totalTeams,
      totalRevenue,
      pendingRegistrations,
    });
  }, []);

  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>12% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>8% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Flag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <ArrowDown className="h-4 w-4 mr-1" />
            <span>3% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>15% from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity and Chart Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between">
            {mockRevenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-blue-500 rounded-t-md" 
                  style={{ height: `${(item.amount / 5500) * 100}%` }}
                ></div>
                <p className="text-xs mt-2 text-gray-600">{item.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Trend</h3>
          <div className="h-64 flex items-end justify-between">
            {mockRegistrationData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-green-500 rounded-t-md" 
                  style={{ height: `${(item.count / 60) * 100}%` }}
                ></div>
                <p className="text-xs mt-2 text-gray-600">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-600">Today, 10:30 AM</p>
            <p className="font-medium">New user registered: Sarah Connor</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm text-gray-600">Today, 9:15 AM</p>
            <p className="font-medium">New event created: Tennis Open Tournament</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="text-sm text-gray-600">Yesterday, 4:30 PM</p>
            <p className="font-medium">Payment received: $100 for Summer Basketball Tournament</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <p className="text-sm text-gray-600">Yesterday, 2:45 PM</p>
            <p className="font-medium">New team registered: Thunderbolts</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <p className="text-sm text-gray-600">Yesterday, 11:20 AM</p>
            <p className="font-medium">Registration cancelled: City Marathon 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;