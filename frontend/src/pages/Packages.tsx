import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useSubscription } from '../hooks/useSubscription';
import PackageSelectionModal from '../components/PackageSelectionModal';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  maxClasses: number | null;
  priority: number;
  packageClasses: {
    class: {
      id: number;
      name: string;
      description: string;
    };
  }[];
}

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [proteinSupplement, setProteinSupplement] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  
  // Use centralized subscription hook
  const { subscription: currentSubscription, hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();

  // Fetch available packages
  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await api.get('/subscriptions/packages');
      return response.data;
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ packageId, proteinSupplement }: { packageId: number; proteinSupplement: boolean }) => {
      const response = await api.post('/subscriptions/subscription', {
        packageId,
        proteinSupplement,
      });
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess('Subscription created!', 'Redirecting to payment...');
      console.log('Payment Intent Client Secret:', data.clientSecret);
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create subscription';
      showError('Subscription Error', errorMessage);
      setIsProcessing(false);
    },
  });

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    createSubscriptionMutation.mutate({ packageId: selectedPackage, proteinSupplement });
  };

  const packages: Package[] = packagesData?.packages || [];

  if (packagesLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        isRequired={false}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Current Subscription Status */}
          {currentSubscription && hasActiveSubscription && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Current Package: {currentSubscription.package.name}
                      </h2>
                      <p className="text-gray-600">{currentSubscription.package.description}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            currentSubscription.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Started:</span> {new Date(currentSubscription.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Ends:</span> {new Date(currentSubscription.endDate).toLocaleDateString()}
                        </p>
                        {currentSubscription.proteinSupplement && (
                          <p className="text-sm text-blue-600">
                            <span className="font-medium">Add-on:</span> Monthly Protein Supplements (+£50/month)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      £{currentSubscription.package.price + (currentSubscription.proteinSupplement ? 50 : 0)}
                    </p>
                    <p className="text-gray-600">/month</p>
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Change Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasActiveSubscription && (
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">No Package Selected</h2>
                      <p className="text-gray-600">
                        You don't have an active subscription. Choose a package below to get started.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPackageModal(true)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Choose Package
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Package
          </h1>
          <p className="text-xl text-gray-600">
            Transform your fitness journey with our comprehensive packages
          </p>
          
          {currentSubscription && (
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Currently subscribed to {currentSubscription.package.name} Package
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                selectedPackage === pkg.id ? 'ring-4 ring-blue-500' : ''
              } ${
                currentSubscription?.packageId === pkg.id ? 'border-2 border-green-500' : ''
              }`}
            >
              {pkg.priority === 3 && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    £{pkg.price}
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">
                      {pkg.maxClasses ? `${pkg.maxClasses} fitness classes` : 'Unlimited fitness classes'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">1 session per day</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">30-day subscription period</span>
                  </div>
                  
                  {pkg.priority === 3 && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-semibold">Priority access & facilities</span>
                    </div>
                  )}
                </div>

                {/* Available Classes */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Available Classes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.packageClasses.slice(0, 6).map((pkgClass) => (
                      <span
                        key={pkgClass.class.id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {pkgClass.class.name}
                      </span>
                    ))}
                    {pkg.packageClasses.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{pkg.packageClasses.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedPackage === pkg.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    currentSubscription?.packageId === pkg.id
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : ''
                  }`}
                >
                  {currentSubscription?.packageId === pkg.id ? 'Current Package' : 'Select Package'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Protein Supplement Option */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Protein Supplements Add-on
              </h3>
              <p className="text-gray-600 mb-2">
                Premium protein shakes to fuel your workouts
              </p>
              <div className="text-sm text-gray-500">
                • 1 bottle per day/session for 30 days<br />
                • Premium quality protein blend<br />
                • Multiple flavor options
              </div>
            </div>
            <div className="text-right ml-8">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                +£50<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={proteinSupplement}
                  onChange={(e) => setProteinSupplement(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Add to package</span>
              </label>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        {selectedPackage && (
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-semibold">
                    {packages.find(p => p.id === selectedPackage)?.name} (£{packages.find(p => p.id === selectedPackage)?.price})
                  </span>
                </div>
                {proteinSupplement && (
                  <div className="flex justify-between">
                    <span>Protein Supplements:</span>
                    <span className="font-semibold">£50</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    £{(packages.find(p => p.id === selectedPackage)?.price || 0) + (proteinSupplement ? 50 : 0)}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || createSubscriptionMutation.isPending}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isProcessing || createSubscriptionMutation.isPending
                ? 'Processing...'
                : 'Subscribe Now'
              }
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
