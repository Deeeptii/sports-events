import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, Tag, Eye, ThumbsUp, Clock, Filter } from 'lucide-react';
import { mockEvents, mockRegistrations, mockTeamMembers, mockTeams, mockPayments } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const ParticipantRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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
        
        // Determine status based on event date and registration status
        const now = new Date();
        let status = reg.registration_status;
        
        if (event && new Date(event.event_date) < now) {
          status = 'completed';
        } else if (status === 'confirmed') {
          status = 'upcoming';
        }
        
        return {
          ...reg,
          event,
          teamName,
          paymentInfo,
          status
        };
      });
      
      // Sort by event date (upcoming first)
      registeredEvents.sort((a, b) => {
        // Completed events at the end
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        
        // Sort by event date
        return new Date(a.event.event_date).getTime() - new Date(b.event.event_date).getTime();
      });
      
      setRegistrations(registeredEvents);
      setFilteredRegistrations(registeredEvents);
      setIsLoading(false);
    }, 800);
    
  }, [user]);

  useEffect(() => {
    let filtered = [...registrations];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter === 'individual') {
      filtered = filtered.filter(reg => !reg.team_id);
    } else if (typeFilter === 'team') {
      filtered = filtered.filter(reg => reg.team_id);
    }
    
    setFilteredRegistrations(filtered);
  }, [registrations, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Upcoming</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">{status}</span>;
    }
  };

  const getPaymentBadge = (paymentInfo: any) => {
    if (!paymentInfo) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Payment Required</span>;
    }
    
    if (paymentInfo.payment_status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Paid</span>;
    }
    
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Payment Pending</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Registrations</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="individual">Individual Events</option>
              <option value="team">Team Events</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-gray-100 p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="text-lg font-bold text-gray-900">{formatDate(registration.event.event_date)}</p>
                      <div className="mt-2">
                        {getStatusBadge(registration.status)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/4">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 mr-2">{registration.event.name}</h3>
                      <div>{getPaymentBadge(registration.paymentInfo)}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-red-600" />
                        <span>{registration.event.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Tag className="h-5 w-5 mr-2 text-blue-600" />
                        <span>{registration.event.category}</span>
                      </div>
                      {registration.teamName ? (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2 text-purple-600" />
                          <span>Team: {registration.teamName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <User className="h-5 w-5 mr-2 text-green-600" />
                          <span>Individual</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Registered on {formatDate(registration.registration_date)}</span>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <Link
                          to={`/events/${registration.event.id}`}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Event
                        </Link>
                        
                        {registration.status === 'completed' && (
                          <Link
                            to={`/participant/feedback/${registration.event.id}`}
                            className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Give Feedback
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No registrations found</h3>
            <p className="text-gray-500 mb-6">
              {statusFilter !== 'all' || typeFilter !== 'all' 
                ? "Try changing your filters" 
                : "You haven't registered for any events yet"}
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantRegistrations;