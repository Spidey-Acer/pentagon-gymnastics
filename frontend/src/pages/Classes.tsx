import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../services/api";
import ClassCard from "../components/ClassCard";
import PackageSelectionModal from "../components/PackageSelectionModal";
import { useSubscription } from "../hooks/useSubscription";

interface PackageType {
  id: number;
  name: string;
  packageClasses?: Array<{
    classId: number;
  }>;
}

interface ClassType {
  id: number;
  name: string;
  description: string;
  sessions: {
    id: number;
    timeSlot: string;
    capacity: number;
    bookingCount: number;
  }[];
  packageClasses?: {
    packageId: number;
    package: {
      id: number;
      name: string;
    };
  }[];
  requiresSubscription?: boolean;
  isIncludedInPackage?: boolean;
  requiresUpgrade?: boolean;
  availableInPackages?: Array<{
    id: number;
    name: string;
  }>;
}

export default function Classes() {
  const [showPackageModal, setShowPackageModal] = useState(false);
  
  // Use consistent subscription state management
  const { subscription: userSubscription, hasActiveSubscription, isLoading: isLoadingSubscription } = useSubscription();
  
  const {
    data: classes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: () => api.get("/classes").then((res) => res.data),
    refetchInterval: 2000, // Auto-refresh every 2 seconds
    refetchIntervalInBackground: true, // Continue refreshing in background
  });

  // Get available packages
  const { data: packagesData } = useQuery({
    queryKey: ["packages"],
    queryFn: () => api.get("/subscriptions/packages").then((res) => res.data.packages),
  });

  // Additional manual refresh on component mount and periodic intervals
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Filter classes based on user's subscription
  const getFilteredClasses = () => {
    if (!classes) return [];
    
    if (!hasActiveSubscription) {
      // Show all classes but mark them as requiring subscription
      return classes.map((cls: ClassType) => ({
        ...cls,
        requiresSubscription: true,
        availableInPackages: packagesData?.filter((pkg: PackageType) =>
          pkg.packageClasses?.some((pc: { classId: number }) => pc.classId === cls.id)
        ) || []
      }));
    }

    // Show classes available in user's package + mark others as upgrade required
    return classes.map((cls: ClassType) => {
      const isIncludedInPackage = userSubscription.package.packageClasses?.some(
        (pc: { classId: number }) => pc.classId === cls.id
      );
      
      return {
        ...cls,
        isIncludedInPackage,
        requiresUpgrade: !isIncludedInPackage,
        availableInPackages: packagesData?.filter((pkg: PackageType) =>
          pkg.packageClasses?.some((pc: { classId: number }) => pc.classId === cls.id)
        ) || []
      };
    });
  };

  const filteredClasses = getFilteredClasses();

  if (isLoading || isLoadingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            Error loading classes:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        isRequired={true}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subscription Status Banner */}
          {userSubscription && userSubscription.status === 'active' ? (
            <div className="mb-6 bg-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      Active Subscription: {userSubscription.package.name} Package
                    </h3>
                    <p className="text-sm text-green-700">
                      You have access to {userSubscription.package.packageClasses?.length || 0} class types
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                >
                  Upgrade Package
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-yellow-100 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      No Active Subscription
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Select a package to start booking classes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700"
                >
                  Select Package
                </button>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Fitness Classes
                </h1>
                <p className="mt-2 text-gray-600">
                  {userSubscription && userSubscription.status === 'active'
                    ? `Classes available in your ${userSubscription.package.name} package`
                    : "Choose from our diverse selection of fitness classes designed to help you achieve your goals"
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Auto-refreshing every 2s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses?.map((cls: ClassType & { 
              isIncludedInPackage?: boolean; 
              requiresUpgrade?: boolean; 
              requiresSubscription?: boolean;
              availableInPackages?: Array<{ id: number; name: string }>;
            }) => (
              <ClassCard 
                key={cls.id} 
                cls={cls}
                userSubscription={userSubscription}
                onSelectPackage={() => setShowPackageModal(true)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
 