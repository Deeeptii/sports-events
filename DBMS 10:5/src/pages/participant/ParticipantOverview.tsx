import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Medal, Star, CheckCircle, Clock } from 'lucide-react';
import { mockEvents, mockRegistrations, mockTeamMembers, mockTeams, mockPayments, mockResults } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const ParticipantOverview: React.FC = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [registrationStats, setRegistrationStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    teamEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get user's individual registrations
      const userRegistrations = mockRegistrations.filter(reg => reg.user_id === user.id);
      
      // Get teams that user is a member of
      const userTeamIds = mockTeamMembers
        .filter(member => member.user_id === user.id)
        .map(member => member.team_id);
      
      // Get team registrations
      const teamRegistrations = mockRegistrations.filter(reg => 
        reg.team_id && userTeamIds.includes(reg.team_id)
      );
      
      // Combine individual and team registrations
      const allRegistrations = [...userRegistrations, ...teamRegistrations];
      
      // Get event details for each registration
      const registeredEvents = allRegistrations.map(reg => {
        const event = mockEvents.find(e => e.id === reg.event_id);
        const teamName = reg.team_id ? 
          mockTeams.find(t => t.id === reg.team_id)?.team_name : null;
        
        const paymentInfo = mockPayments.find(p => p.registration_id === reg.id);
        const resultInfo = mockResults.find(r => 
          r.event_id === reg.event_id && 
          (r.user_id === user.id || (r.team_id && userTeamIds.includes(r.team_id)))
        );
        
        return {
          ...reg,
          event: event,
          teamName,
          paymentInfo,
          resultInfo
        };
      });
      
      // Filter for upcoming events (event date is in the future)
      const now = new Date();
      const upcoming = registeredEvents
        .filter(reg => reg.event && new Date(reg.event.event_date) > now)
        .sort((a, b) => new Date(a.event.event_date).getTime() - new Date(b.event.event_date).getTime());
      
      setUpcomingEvents(upcoming);
      
      // Calculate statistics
      const completed = registeredEvents.filter(reg => reg.event && new Date(reg.event.event_date) < now).length;
      const teamEvents = registeredEvents.filter(reg => reg.team_id).length;
      
      setRegistrationStats({
        total: registeredEvents.length,
        upcoming: upcoming.length,
        completed,
        teamEvents,
      });
      
      setIsLoading(false);
    }, 800);
    
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Track your sports event registrations, upcoming events, and achievements all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{registrationStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{registrationStats.upcoming}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Events</p>
              <p className="text-2xl font-bold text-gray-900">{registrationStats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Medal className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Team Events</p>
              <p className="text-2xl font-bold text-gray-900">{registrationStats.teamEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((registration) => (
              <div key={registration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{registration.event.name}</h4>
                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(registration.event.event_date)}</span>
                      </div>
                      {registration.teamName && (
                        <div className="flex items-center">
                          <Medal className="h-4 w-4 mr-1" />
                          <span>Team: {registration.teamName}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span>
                          {registration.paymentInfo?.payment_status === 'completed' 
                            ? 'Paid' 
                            : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <div className="text-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md">
                      <span className="block text-lg font-bold">{getDaysRemaining(registration.event.event_date)}</span>
                      <span className="text-xs">days left</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {upcomingEvents.length > 3 && (
              <div className="text-center mt-4">
                <Link 
                  to="/participant/registrations" 
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all upcoming events
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-4">You don't have any upcoming events</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-gray-800 font-medium">Browse Events</span>
          </Link>
          <Link
            to="/participant/registrations"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Clock className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-gray-800 font-medium">My Registrations</span>
          </Link>
          <Link
            to="/participant/payments"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <CreditCard className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-gray-800 font-medium">Payment History</span>
          </Link>
          <Link
            to="/participant/results"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <Star className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-gray-800 font-medium">My Results</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParticipantOverview;