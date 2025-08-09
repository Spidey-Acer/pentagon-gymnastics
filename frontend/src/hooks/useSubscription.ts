import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface PackageClass {
  classId: number;
  class: {
    id: number;
    name: string;
    description: string;
  };
}

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  maxClasses: number | null;
  packageClasses: PackageClass[];
}

interface Subscription {
  id: number;
  userId: number;
  packageId: number;
  status: string;
  startDate: string;
  endDate: string;
  proteinSupplement: boolean;
  proteinSupplementPrice: number;
  package: Package;
}

interface SubscriptionData {
  success: boolean;
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
}

export const useSubscription = () => {
  const {
    data: subscriptionData,
    isLoading,
    error,
    refetch,
  } = useQuery<SubscriptionData>({
    queryKey: ["userSubscription"],
    queryFn: () => api.get("/subscriptions/user").then((res) => res.data),
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes (gcTime replaces cacheTime in newer versions)
  });

  const subscription = subscriptionData?.subscription || null;
  const hasActiveSubscription = subscription?.status === "active";

  const canAccessClass = (classId: number) => {
    if (!hasActiveSubscription || !subscription) return false;

    return (
      subscription.package?.packageClasses?.some(
        (pc: PackageClass) => pc.classId === classId
      ) || false
    );
  };

  const getClassAccess = (classId: number) => {
    if (!hasActiveSubscription || !subscription) {
      return {
        hasAccess: false,
        reason: "subscription_required",
        message: "Active subscription required",
      };
    }

    if (canAccessClass(classId)) {
      return {
        hasAccess: true,
        reason: "included",
        message: `Included in your ${
          subscription.package?.name || "current"
        } package`,
      };
    }

    return {
      hasAccess: false,
      reason: "upgrade_required",
      message: `Not included in your ${
        subscription.package?.name || "current"
      } package`,
    };
  };

  return {
    subscription,
    subscriptionData,
    isLoading,
    error,
    refetch,
    hasActiveSubscription: hasActiveSubscription || false,
    canAccessClass,
    getClassAccess,
  };
};
