import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useSubscription = () => {
  const {
    data: subscription,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userSubscription'],
    queryFn: () => api.get('/subscriptions/user').then(res => res.data.subscription),
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const hasActiveSubscription = subscription && subscription.status === 'active';
  
  const canAccessClass = (classId: number) => {
    if (!hasActiveSubscription) return false;
    
    return subscription.package.packageClasses?.some(
      (pc: { classId: number }) => pc.classId === classId
    ) || false;
  };

  const getClassAccess = (classId: number) => {
    if (!hasActiveSubscription) {
      return {
        hasAccess: false,
        reason: 'subscription_required',
        message: 'Active subscription required'
      };
    }

    if (canAccessClass(classId)) {
      return {
        hasAccess: true,
        reason: 'included',
        message: `Included in your ${subscription.package.name} package`
      };
    }

    return {
      hasAccess: false,
      reason: 'upgrade_required',
      message: `Not included in your ${subscription.package.name} package`
    };
  };

  return {
    subscription,
    isLoading,
    error,
    refetch,
    hasActiveSubscription,
    canAccessClass,
    getClassAccess,
  };
};
