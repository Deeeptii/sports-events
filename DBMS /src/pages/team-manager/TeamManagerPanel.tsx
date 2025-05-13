import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Flag, Calendar, Settings, BarChart2 } from 'lucide-react';
import TeamManagerDashboard from './TeamManagerDashboard';
import TeamManagerTeams from './TeamManagerTeams';

const TeamManagerPanel: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === `/team-manager${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-600 text-white p-4">
                <h2 className="text-xl font-semibold">Team Manager Panel</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/team-manager"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BarChart2 className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/team-manager/teams"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/teams') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      My Teams
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/team-manager/events"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/events') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      Event Registrations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/team-manager/results"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/results') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Flag className="h-5 w-5 mr-3" />
                      Team Results
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/team-manager/settings"
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive('/settings') ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'
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
              <Route path="/" element={<TeamManagerDashboard />} />
              <Route path="/teams" element={<TeamManagerTeams />} />
              <Route path="/events" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Event Registrations</h2><p>Your team event registrations will be displayed here.</p></div>} />
              <Route path="/results" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Team Results</h2><p>Your team results will be displayed here.</p></div>} />
              <Route path="/settings" element={<div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Account Settings</h2><p>Account settings interface will be implemented here.</p></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagerPanel;