import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import SimulatedPaymentForm from './SimulatedPaymentForm';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  maxClasses: number | null;
  priority: number;
  isActive: boolean;
  packageClasses: Array<{
    class: {
      id: number;
      name: string;
      description: string;
    };
  }>;
}

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRequired?: boolean;
}

export default function PackageSelectionModal({ isOpen, onClose, isRequired = false }: PackageSelectionModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [addProtein, setAddProtein] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/subscriptions/packages').then(res => res.data.packages),
    enabled: isOpen,
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: { packageId: number; proteinSupplement: boolean }) => {
      const response = await api.post('/subscriptions/create', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Handle successful subscription creation - now requires payment
      setSubscriptionData(data);
      setShowPayment(true);
      showSuccess('Subscription Created', 'Please complete payment to activate your subscription.');
    },
    onError: (error: unknown) => {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create subscription';
      showError('Subscription Failed', errorMessage);
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const handlePaymentSuccess = (paymentId: number) => {
    // Payment successful - invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['classes'] });
    queryClient.invalidateQueries({ queryKey: ['bookedSessions'] });
    queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
    
    showSuccess('Payment Successful', 'Your subscription has been activated!');
    onClose();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSubscriptionData(null);
  };

  const handleSubscribe = async () => {
    if (!selectedPackage) {
      showError('No Package Selected', 'Please select a package to continue.');
      return;
    }

    setIsProcessing(true);
    createSubscriptionMutation.mutate({
      packageId: selectedPackage.id,
      proteinSupplement: addProtein,
    });
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price + (addProtein ? 50 : 0);
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isRequired ? 'Select Your Package' : 'Choose a Package'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isRequired 
                  ? 'You need an active subscription to access Pentagon Gymnastics features.'
                  : 'Upgrade or change your subscription package.'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {packages?.map((pkg: Package) => (
              <div
                key={pkg.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                  selectedPackage?.id === pkg.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {selectedPackage?.id === pkg.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">£{pkg.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="text-left space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {pkg.maxClasses ? `${pkg.maxClasses} classes per month` : 'Unlimited classes'}
                    </li>
                    {pkg.packageClasses.map((packageClass, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Access to {packageClass.class.name}
                      </li>
                    ))}
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Online booking system
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Equipment rental discounts
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Protein Supplement Add-on */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={addProtein}
                onChange={(e) => setAddProtein(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">Add Monthly Protein Supplements</span>
                <span className="ml-2 text-blue-600 font-semibold">+£50/month</span>
                <p className="text-sm text-gray-600 mt-1">
                  Premium protein powder delivered monthly to support your fitness goals
                </p>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          {selectedPackage && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{selectedPackage.name} Package</span>
                  <span>£{selectedPackage.price}/month</span>
                </div>
                {addProtein && (
                  <div className="flex justify-between text-sm">
                    <span>Protein Supplements</span>
                    <span>£50/month</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£{calculateTotal()}/month</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {!isRequired && (
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubscribe}
              disabled={!selectedPackage || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Subscribe for £${calculateTotal()}/month`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPayment && subscriptionData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-4xl w-full mx-4">
            <SimulatedPaymentForm
              amount={subscriptionData.amount}
              description={`${selectedPackage?.name} Package Subscription${addProtein ? ' + Protein Supplements' : ''}`}
              subscriptionId={subscriptionData.subscription.id}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
