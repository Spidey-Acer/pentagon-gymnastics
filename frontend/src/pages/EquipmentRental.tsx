import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useSubscription } from "../hooks/useSubscription";
import PackageSelectionModal from "../components/PackageSelectionModal";

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  availableStock: number;
  imageUrl?: string;
  discountPercentage?: number;
}

interface RentalCartItem {
  equipment: Equipment;
  quantity: number;
  duration: 'day' | 'week' | 'month';
  totalPrice: number;
}

export default function EquipmentRental() {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [cart, setCart] = useState<RentalCartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  // Use subscription hook for access control
  const { subscription: userSubscription, hasActiveSubscription } = useSubscription();

  // Fetch equipment
  const { data: equipment, isLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: () => api.get("/gear").then((res) => res.data),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Show package modal if no active subscription
  const checkSubscriptionAndProceed = (action: () => void) => {
    if (!hasActiveSubscription) {
      setShowPackageModal(true);
      return;
    }
    action();
  };

  const addToCart = (equipment: Equipment, duration: 'day' | 'week' | 'month') => {
    const price = duration === 'day' ? equipment.pricePerDay :
                 duration === 'week' ? equipment.pricePerWeek :
                 equipment.pricePerMonth;
    
    const discount = userSubscription?.package ? (equipment.discountPercentage || 10) : 0;
    const discountedPrice = price * (1 - discount / 100);

    const existingItem = cart.find(item => 
      item.equipment.id === equipment.id && item.duration === duration
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.equipment.id === equipment.id && item.duration === duration
          ? { ...item, quantity: item.quantity + 1, totalPrice: discountedPrice * (item.quantity + 1) }
          : item
      ));
    } else {
      setCart([...cart, {
        equipment,
        quantity: 1,
        duration,
        totalPrice: discountedPrice
      }]);
    }

    showSuccess("Added to Cart", `${equipment.name} added to your rental cart`);
  };

  const removeFromCart = (equipmentId: number, duration: string) => {
    setCart(cart.filter(item => 
      !(item.equipment.id === equipmentId && item.duration === duration)
    ));
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const categories = ['all', 'weights', 'cardio', 'flexibility', 'accessories'];
  
  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment?.filter((item: Equipment) => item.category.toLowerCase() === selectedCategory);

  const getDurationPrice = (equipment: Equipment, duration: 'day' | 'week' | 'month') => {
    const basePrice = duration === 'day' ? equipment.pricePerDay :
                     duration === 'week' ? equipment.pricePerWeek :
                     equipment.pricePerMonth;
    
    if (userSubscription?.package) {
      const discount = equipment.discountPercentage || 10;
      return basePrice * (1 - discount / 100);
    }
    return basePrice;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        isRequired={!hasActiveSubscription}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Equipment Rental</h1>
            <p className="mt-2 text-gray-600">
              Rent professional gym equipment with exclusive member discounts
            </p>
          </div>

          {/* Subscription Status */}
          {hasActiveSubscription ? (
            <div className="mb-6 bg-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    {userSubscription.package.name} Member Discount Active
                  </h3>
                  <p className="text-sm text-green-700">
                    Enjoy 10% discount on all equipment rentals!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-yellow-100 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Get Member Discounts
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Subscribe to a package to unlock equipment rental discounts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700"
                >
                  View Packages
                </button>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Equipment Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment?.map((item: Equipment) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Per Day</span>
                          <div className="flex items-center space-x-2">
                            {userSubscription && (
                              <span className="text-xs text-gray-400 line-through">£{item.pricePerDay}</span>
                            )}
                            <span className="font-semibold text-gray-900">
                              £{getDurationPrice(item, 'day').toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Per Week</span>
                          <div className="flex items-center space-x-2">
                            {userSubscription && (
                              <span className="text-xs text-gray-400 line-through">£{item.pricePerWeek}</span>
                            )}
                            <span className="font-semibold text-gray-900">
                              £{getDurationPrice(item, 'week').toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Per Month</span>
                          <div className="flex items-center space-x-2">
                            {userSubscription && (
                              <span className="text-xs text-gray-400 line-through">£{item.pricePerMonth}</span>
                            )}
                            <span className="font-semibold text-gray-900">
                              £{getDurationPrice(item, 'month').toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => checkSubscriptionAndProceed(() => addToCart(item, 'day'))}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700"
                          >
                            Rent Daily
                          </button>
                          <button
                            onClick={() => checkSubscriptionAndProceed(() => addToCart(item, 'week'))}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-xs hover:bg-green-700"
                          >
                            Rent Weekly
                          </button>
                        </div>
                        <button
                          onClick={() => checkSubscriptionAndProceed(() => addToCart(item, 'month'))}
                          className="w-full bg-purple-600 text-white py-2 px-3 rounded text-xs hover:bg-purple-700"
                        >
                          Rent Monthly
                        </button>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {item.availableStock} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Cart</h3>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <p className="text-gray-500 text-sm mt-2">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.equipment.name}</h4>
                              <p className="text-xs text-gray-500">
                                {item.duration} rental × {item.quantity}
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                £{item.totalPrice.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.equipment.id, item.duration)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>£{getTotalCartValue().toFixed(2)}</span>
                      </div>
                      {userSubscription && (
                        <p className="text-xs text-green-600 mt-1">
                          Member discount applied!
                        </p>
                      )}
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-4">
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
