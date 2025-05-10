import React from 'react';
import { Calendar, Users, DollarSign, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { mockEvents, mockRegistrations, mockPayments, mockFeedback } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Filter events for this organizer
  const organizerEvents = mockEvents.filter(event => event.organizer_id === user?.id);
  
  // Filter related data
  const eventIds = organizerEvents.map(event => event.id);
  const registrations = mockRegistrations.filter(reg => eventIds.includes(reg.event_id));
  const totalParticipants = registrations.length;
  
  const confirmedRegistrations = registrations.filter(reg => reg.registration_status === 'confirmed');
  const pendingRegistrations = registrations.filter(reg => reg.registration_status === 'pending');
  
  const feedback = mockFeedback.filter(fb => eventIds.includes(fb.event_id));
  const averageRating = feedback.length > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : 'N/A';
  
  const registrationPayments = mockPayments.filter(
    payment => registrations.some(reg => reg.id === payment.registration_id)
  );
  
  const totalRevenue = registrationPayments.reduce((sum, payment) => {
    return sum + (payment.payment_status === 'completed' ? payment.amount : 0);
  }, 0);

  // Upcoming event
  const upcomingEvents = organizerEvents
    .filter(event => new Date(event.event_date) > new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back, {user?.name}!</h2>
        <p className="text-gray-600">
          Here's an overview of your events and registrations. You have {organizerEvents.length} events and {totalParticipants} total registrations.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{organizerEvents.length}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+2 from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedRegistrations.length}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+{pendingRegistrations.length} pending</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>10% from last event</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>From {feedback.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Next Event */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Next Upcoming Event</h3>
            </div>
            <div className="p-6">
              {nextEvent ? (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{nextEvent.name}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                      <span>{formatDate(nextEvent.event_date)}</span>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-2 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Registrations</p>
                        <p className="text-gray-600">
                          {registrations.filter(r => r.event_id === nextEvent.id).length} total
                          ({registrations.filter(r => r.event_id === nextEvent.id && r.registration_status === 'confirmed').length} confirmed)
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(registrations.filter(r => r.event_id === nextEvent.id).length / 50 * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">Registration progress</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p>No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">Today, 10:30 AM</p>
                  <p className="font-medium">New registration received for Summer Basketball Tournament</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">Today, 9:15 AM</p>
                  <p className="font-medium">Payment confirmed: $100 for event registration</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">Yesterday, 2:45 PM</p>
                  <p className="font-medium">New team registered: Thunderbolts</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">Yesterday, 11:20 AM</p>
                  <p className="font-medium">New feedback received for City Marathon 2025 (4★)</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">2 days ago, 3:30 PM</p>
                  <p className="font-medium">Registration cancelled: Tennis Open Tournament</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizerEvents.slice(0, 5).map((event) => {
                const eventRegistrations = registrations.filter(r => r.event_id === event.id);
                const eventFeedback = feedback.filter(f => f.event_id === event.id);
                const eventRating = eventFeedback.length > 0
                  ? (eventFeedback.reduce((sum, item) => sum + item.rating, 0) / eventFeedback.length).toFixed(1)
                  : '-';
                
                const eventRevenue = registrationPayments
                  .filter(payment => eventRegistrations.some(reg => reg.id === payment.registration_id))
                  .reduce((sum, payment) => sum + (payment.payment_status === 'completed' ? payment.amount : 0), 0);
                
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{formatDate(event.event_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{eventRegistrations.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">${eventRevenue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`${parseFloat(eventRating as string) >= 4 ? 'text-green-600' : parseFloat(eventRating as string) >= 3 ? 'text-amber-600' : 'text-gray-600'}`}>
                          {eventRating}
                        </span>
                        {eventRating !== '-' && (
                          <span className="text-yellow-400 ml-1">★</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {organizerEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;