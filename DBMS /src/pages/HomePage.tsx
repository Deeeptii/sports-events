import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Filter, Search } from 'lucide-react';
import { mockEvents } from '../utils/mockData';

type Event = {
  id: number;
  name: string;
  event_date: string;
  venue: string;
  category: string;
  image: string;
  description: string;
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  

  const categories = [...new Set(mockEvents.map(event => event.category))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90"></div>
          <img
            src="https://images.pexels.com/photos/6203466/pexels-photo-6203466.jpeg"
            alt="Sports background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Find Your Perfect Sporting Event</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Discover and register for sports events across India. Whether you're an athlete or just want to have fun, we have something for everyone.
            </p>
            <Link
              to="/register"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-10 bg-gray-300 rounded w-1/3 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500">Try changing your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose SportEvents India?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
              <p className="text-gray-600">
                Register for events quickly and securely. Manage your registrations in one place.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
              <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Create and manage your teams. Add team members and register your entire team for events.
              </p>
            </div>
            <div className="p-6 bg-orange-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
              <div className="rounded-full bg-orange-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant updates about event changes, results, and important announcements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;