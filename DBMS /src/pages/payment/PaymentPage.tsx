import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreditCard, IndianRupee, Shield, CheckCircle } from 'lucide-react';
import { mockEvents } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';

type PaymentMethod = 'credit-card' | 'upi';

interface PaymentFormData {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

const PaymentPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const event = mockEvents.find(e => e.id === Number(eventId));
  
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="mt-2 text-gray-600">The event you're trying to pay for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real app, we would make an API call here
      // For demo, we'll simulate a successful payment
      navigate(`/payment/success/${eventId}`);
      toast.success('Payment successful!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Complete Your Registration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.name}</h4>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Registration Fee</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(event.fee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 border rounded-lg text-center ${
                        paymentMethod === 'credit-card'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('credit-card')}
                    >
                      <CreditCard className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </button>
                    <button
                      type="button"
                      className={`p-4 border rounded-lg text-center ${
                        paymentMethod === 'upi'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <IndianRupee className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">UPI</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {paymentMethod === 'credit-card' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          {...register('cardNumber', {
                            required: 'Card number is required',
                            pattern: {
                              value: /^[0-9]{16}$/,
                              message: 'Please enter a valid card number'
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            {...register('cardExpiry', {
                              required: 'Expiry date is required',
                              pattern: {
                                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                message: 'Please enter a valid expiry date (MM/YY)'
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                          />
                          {errors.cardExpiry && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardExpiry.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            {...register('cardCvv', {
                              required: 'CVV is required',
                              pattern: {
                                value: /^[0-9]{3,4}$/,
                                message: 'Please enter a valid CVV'
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123"
                          />
                          {errors.cardCvv && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardCvv.message}</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        {...register('upiId', {
                          required: 'UPI ID is required',
                          pattern: {
                            value: /^[\w\.\-_]{3,}@[a-zA-Z]{3,}$/,
                            message: 'Please enter a valid UPI ID'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="username@upi"
                      />
                      {errors.upiId && (
                        <p className="mt-1 text-sm text-red-600">{errors.upiId.message}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay ${formatCurrency(event.fee)}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;