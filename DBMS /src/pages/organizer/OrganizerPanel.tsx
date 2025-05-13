import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Clipboard, MessageSquare, BarChart2, Settings } from 'lucide-react';
import OrganizerDashboard from './OrganizerDashboard';
import OrganizerEvents from './OrganizerEvents';

const OrganizerPanel: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === `/organizer${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-700 text-white p-4">
                <h2 className="text-xl font-semibold">Organizer Panel</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/organizer"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BarChart2 className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/organizer/events"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/events') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      My Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/organizer/participants"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/participants') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      Participants
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/organizer/registrations"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/registrations') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clipboard className="h-5 w-5 mr-3" />
                      Registrations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/organizer/feedback"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/feedback') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5 mr-3" />
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/organizer/settings"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/settings') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
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
              <Route path="/" element={<OrganizerDashboard />} />
              <Route path="/events" element={<OrganizerEvents />} />
              <Route path="/participants" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Participants Management</h2><p>Participants management interface will be implemented here.</p></div>} />
              <Route path="/registrations" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Registrations Management</h2><p>Registrations management interface will be implemented here.</p></div>} />
              <Route path="/feedback" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Feedback Management</h2><p>Feedback management interface will be implemented here.</p></div>} />
              <Route path="/settings" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Account Settings</h2><p>Account settings interface will be implemented here.</p></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPanel;