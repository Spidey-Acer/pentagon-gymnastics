import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../services/api";
import ClassCard from "../components/ClassCard";
import PackageSelectionModal from "../components/PackageSelectionModal";

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
}

export default function Classes() {
  const [showPackageModal, setShowPackageModal] = useState(false);
  
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

  // Get user's current subscription
  const { data: userSubscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["userSubscription"],
    queryFn: () => api.get("/subscriptions/user").then((res) => res.data.subscription),
    retry: false,
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
    
    if (!userSubscription || userSubscription.status !== 'active') {
      // Show all classes but mark them as requiring subscription
      return classes.map((cls: ClassType) => ({
        ...cls,
        requiresSubscription: true,
        availableInPackages: packagesData?.filter((pkg: any) => 
          pkg.packageClasses?.some((pc: any) => pc.classId === cls.id)
        ) || []
      }));
    }

    // Show classes available in user's package + mark others as upgrade required
    return classes.map((cls: ClassType) => {
      const isIncludedInPackage = userSubscription.package.packageClasses?.some(
        (pc: any) => pc.classId === cls.id
      );
      
      return {
        ...cls,
        isIncludedInPackage,
        requiresUpgrade: !isIncludedInPackage,
        availableInPackages: packagesData?.filter((pkg: any) => 
          pkg.packageClasses?.some((pc: any) => pc.classId === cls.id)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fitness Classes
              </h1>
              <p className="mt-2 text-gray-600">
                Choose from our diverse selection of fitness classes designed to
                help you achieve your goals
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Auto-refreshing every 2s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes?.map(
            (cls: {
              id: number;
              name: string;
              description: string;
              sessions: {
                id: number;
                timeSlot: string;
                capacity: number;
                bookingCount: number;
              }[];
            }) => (
              <ClassCard key={cls.id} cls={cls} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
 