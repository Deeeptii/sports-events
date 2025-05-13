import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Flag, DollarSign, BarChart2, Settings, Clipboard, MessageSquare } from 'lucide-react';
import AdminUsers from './AdminUsers';
import AdminEvents from './AdminEvents';
import AdminOverview from './AdminOverview';
import AdminTeams from './AdminTeams';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === `/admin${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-700 text-white p-4">
                <h2 className="text-xl font-semibold">Admin Dashboard</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/admin"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BarChart2 className="h-5 w-5 mr-3" />
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/users"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/events"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/events') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/teams"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/teams') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Flag className="h-5 w-5 mr-3" />
                      Teams
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/registrations"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/registrations') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clipboard className="h-5 w-5 mr-3" />
                      Registrations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/payments"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/payments') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <DollarSign className="h-5 w-5 mr-3" />
                      Payments
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/feedback"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/feedback') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5 mr-3" />
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/settings"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/settings') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/events" element={<AdminEvents />} />
              <Route path="/teams" element={<AdminTeams />} />
              <Route path="/registrations" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Registrations Management</h2><p>Registrations management interface will be implemented here.</p></div>} />
              <Route path="/payments" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Payments Management</h2><p>Payments management interface will be implemented here.</p></div>} />
              <Route path="/feedback" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Feedback Management</h2><p>Feedback management interface will be implemented here.</p></div>} />
              <Route path="/settings" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">System Settings</h2><p>System settings interface will be implemented here.</p></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;