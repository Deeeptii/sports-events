import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { mockEvents } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';

const PaymentSuccessPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = mockEvents.find(e => e.id === Number(eventId));

  useEffect(() => {
    // Simulate registration completion
    // In a real app, this would be handled by the payment webhook
    console.log('Registration completed for event:', eventId);
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-gray-600">
                Your registration for {event.name} has been confirmed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(event.fee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your registered email address.
              </p>
              <div className="space-x-4">
                <Link
                  to="/participant/registrations"
                  className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  View My Registrations
                </Link>
                <Link
                  to="/"
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;