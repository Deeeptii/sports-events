import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Eye, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockEvents, mockRegistrations } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

type Event = {
  id: number;
  name: string;
  event_date: string;
  venue: string;
  category: string;
  description: string;
  image: string;
  status: string;
  registration_deadline: string;
  fee: number;
  organizer_id: number;
};

const OrganizerEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get organizer's events
    setIsLoading(true);
    setTimeout(() => {
      // Filter events for this organizer
      const organizerEvents = mockEvents.filter(event => event.organizer_id === user?.id);
      
      // Add some computed properties for UI
      const now = new Date();
      const eventsWithStatus = organizerEvents.map(event => {
        const eventDate = new Date(event.event_date);
        let status = event.status;
        
        if (eventDate < now) {
          status = 'completed';
        } else if (new Date(event.registration_deadline) < now) {
          status = 'registration_closed';
        } else {
          status = 'upcoming';
        }
        
        return {
          ...event,
          status
        };
      });
      
      setEvents(eventsWithStatus);
      setFilteredEvents(eventsWithStatus);
      setIsLoading(false);
    }, 800);
  }, [user]);

  useEffect(() => {
    let result = [...events];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(event => event.status === statusFilter);
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const getRegistrationCount = (eventId: number) => {
    return mockRegistrations.filter(reg => reg.event_id === eventId).length;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded animate-pulse">Upcoming</span>;
      case 'registration_closed':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Registration Closed</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">{status}</span>;
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Events</h2>
          <Link
            to="/organizer/events/create"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all duration-200"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="registration_closed">Registration Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredEvents.length > 0 ? (
              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover md:h-48"
                        />
                      </div>
                      <div className="p-6 md:w-3/4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 mr-2">{event.name}</h3>
                          <div>{getStatusBadge(event.status)}</div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-5 w-5 mr-2 text-green-600" />
                            <span>{formatDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2 text-red-600" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2 text-blue-600" />
                            <span>{getRegistrationCount(event.id)} registrations</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-gray-700 font-semibold">
                            {formatCurrency(event.fee)}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/events/${event.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/organizer/events/edit/${event.id}`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter 
                    ? "Try changing your search criteria" 
                    : "You haven't created any events yet"}
                </p>
                <Link
                  to="/organizer/events/create"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerEvents;