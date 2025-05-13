import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Star, CreditCard, Medal, Settings, Clock } from 'lucide-react';
import ParticipantOverview from './ParticipantOverview';
import ParticipantRegistrations from './ParticipantRegistrations';

const ParticipantDashboard: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === `/participant${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-semibold">Participant Dashboard</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/participant"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="h-5 w-5 mr-3" />
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/participant/registrations"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/registrations') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      My Registrations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/participant/payments"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/payments') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      Payment History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/participant/results"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/results') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Medal className="h-5 w-5 mr-3" />
                      My Results
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/participant/feedback"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/feedback') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Star className="h-5 w-5 mr-3" />
                      My Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/participant/settings"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
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
              <Route path="/" element={<ParticipantOverview />} />
              <Route path="/registrations" element={<ParticipantRegistrations />} />
              <Route path="/payments" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Payment History</h2><p>Your payment history will be displayed here.</p></div>} />
              <Route path="/results" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">My Results</h2><p>Your event results will be displayed here.</p></div>} />
              <Route path="/feedback" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">My Feedback</h2><p>Your feedback history will be displayed here.</p></div>} />
              <Route path="/settings" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Account Settings</h2><p>Account settings interface will be implemented here.</p></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;