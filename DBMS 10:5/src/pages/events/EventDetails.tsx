import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, CreditCard, Award, User, AlertTriangle } from 'lucide-react';
import { mockEvents, mockTeams, mockRegistrations } from '../../utils/mockData';
import { supabase } from '../../services/database.service' //'../services/database.service';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to format date
  const formatDate = (dateString: string) => {
    console.log('HERE3')
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if registration deadline has passed
  const isRegistrationClosed = (event: any) => {
    console.log('HERE2')
    if (!event?.registration_deadline) return false;
    const deadline = new Date(event.registration_deadline);
    const today = new Date();
    return today > deadline;
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
     
      console.log('here111')
      if (!eventId) return;
  
      setIsLoading(true);
  
      try {
        console.log(eventId)
        // 1️⃣ Fetch the event by ID
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
  
        if (eventError) throw eventError;
  
        setEvent(eventData);
  
        // 2️⃣ Check if user is registered (individual or via team)
        if (user && eventData) {
          const { data: registrationData, error: registrationError } = await supabase
            .from('registrations')
            .select('id, event_id, user_id, team_id')
            .eq('event_id', eventData.id)
            .or(`user_id.eq.${user.id}, team_id.in (select id from teams where created_by.eq.${user.id})`);
  
          if (registrationError) throw registrationError;
  
          setIsAlreadyRegistered(!!registrationData?.length);
        }
      } catch (err) {
        console.error('Error fetching event details or registration:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEventDetails();
  }, [eventId, user]);
  

  const handleRegister = () => {
    console.log('HERE5')
    if (!user) {
      toast.error('Please login to register for this event');
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    // Simulate API call for registration
    setTimeout(() => {
      setIsAlreadyRegistered(true);
      setIsRegistering(false);
      toast.success('Successfully registered for the event!');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const registrationClosed = isRegistrationClosed(event);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Event Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md mb-2">
            {event.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.name}</h1>
          <div className="flex flex-wrap items-center text-white gap-x-4 gap-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>₹{event.fee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 mb-6">{event.description}</p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">{formatDate(event.event_date)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Venue</p>
                  <p className="text-gray-600">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Registration Deadline</p>
                  <p className="text-gray-600">{formatDate(event.registration_deadline)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Category</p>
                  <p className="text-gray-600">{event.category}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Organizer</p>
                  <p className="text-gray-600">Sports Authority of India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rules & Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Participants must arrive 30 minutes before the event starts for check-in.</li>
              <li>All participants must bring valid identification.</li>
              <li>Equipment will be provided, but participants can bring their own.</li>
              <li>Teams must have a minimum of 4 and maximum of 6 players.</li>
              <li>All participants must sign a waiver form before the event.</li>
              <li>No refunds will be provided after the registration deadline.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Registration Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registration</h3>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Registration Fee</span>
              <span className="text-2xl font-bold text-gray-900">₹{event.fee}</span>
            </div>
            
            {registrationClosed ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-700">
                    Registration deadline has passed. Event is no longer accepting new registrations.
                  </p>
                </div>
              </div>
            ) : isAlreadyRegistered ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-800 font-medium">
                  You're registered for this event!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Check your dashboard for more details.
                </p>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transform hover:scale-105"
              >
                {isRegistering ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register Now'
                )}
              </button>
            )}
            
            {!user && !registrationClosed && !isAlreadyRegistered && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                You need to{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  sign in
                </Link>{' '}
                to register
              </p>
            )}
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Registration includes:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Official event entry</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Event kit and materials</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Access to all facilities</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Refreshments during event</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Participation certificate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;