import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import PackageSelectionModal from "./PackageSelectionModal";
import { useSubscription } from "../hooks/useSubscription";

interface ClassCardProps {
  cls: {
    id: number;
    name: string;
    description: string;
    sessions: {
      id: number;
      timeSlot: string;
      capacity: number;
      bookingCount: number;
    }[];
    isIncludedInPackage?: boolean;
    requiresUpgrade?: boolean;
    requiresSubscription?: boolean;
    availableInPackages?: Array<{
      id: number;
      name: string;
    }>;
  };
  userSubscription?: {
    id: number;
    status: string;
    package: {
      id: number;
      name: string;
      packageClasses?: Array<{ classId: number }>;
    };
  };
  onSelectPackage?: () => void;
}

const getClassIcon = (className: string) => {
  const icons: { [key: string]: string } = {
    Yoga: "🧘‍♀️",
    Spin: "🚴‍♂️",
    "Boot Camp": "🏋️‍♂️",
    Barre: "🩰",
    Pilates: "🤸‍♀️",
    Orangetheory: "🧡",
    CrossFit: "💪",
    Hybrid: "⚡",
  };
  return icons[className] || "🏃‍♂️";
};

const getTimeSlotDisplay = (timeSlot: string) => {
  const timeSlots: { [key: string]: string } = {
    morning: "6:00 AM - 9:00 AM",
    afternoon: "12:00 PM - 3:00 PM",
    evening: "6:00 PM - 9:00 PM",
  };
  return timeSlots[timeSlot] || timeSlot;
};

export default function ClassCard({ cls, userSubscription, onSelectPackage }: ClassCardProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [showPackageModal, setShowPackageModal] = useState(false);
  
  // Use subscription hook for access validation
  const { getClassAccess } = useSubscription();

  // Check user subscription status from props instead of fetching again
  const hasActiveSubscription = userSubscription && userSubscription.status === 'active';
  
  // Get detailed access information for this specific class
  const classAccess = getClassAccess(cls.id);

  const mutation = useMutation({
    mutationFn: (sessionId: number) =>
      api.post("/sessions/book", { sessionId }).then((res) => res.data),
    onSuccess: () => {
      // Invalidate classes query to refresh session data
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["bookedSessions"] });
      showSuccess("Booking Successful!", "Your session has been booked successfully.");
    },
    onError: (error: Error | { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Unknown error";
      showError("Booking Failed", errorMessage);
    },
  });

  const handleBookNow = (sessionId: number) => {
    // Check if user has an active subscription
    if (!hasActiveSubscription) {
      if (onSelectPackage) {
        onSelectPackage();
      } else {
        setShowPackageModal(true);
      }
      return;
    }

    // Check if class is included in user's package
    if (cls.requiresUpgrade) {
      if (onSelectPackage) {
        onSelectPackage();
      } else {
        setShowPackageModal(true);
      }
      return;
    }

    // User has active subscription and access to this class, proceed with booking
    mutation.mutate(sessionId);
  };

  const getClassStatusBadge = () => {
    if (!hasActiveSubscription) {
      return (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 7.707 6.621a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">Subscription Required</span>
            </div>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Available in: {cls.availableInPackages?.map(pkg => pkg.name).join(', ') || 'Select a package'}
          </p>
        </div>
      );
    }

    if (cls.requiresUpgrade) {
      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-blue-800">Upgrade Required</span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Not included in your {userSubscription?.package?.name} package. Available in: {cls.availableInPackages?.map(pkg => pkg.name).join(', ')}
          </p>
        </div>
      );
    }

    if (cls.isIncludedInPackage) {
      return (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">Included in your {userSubscription?.package?.name} package</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        isRequired={true}
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getClassIcon(cls.name)}</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {cls.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{cls.description}</p>
              </div>
            </div>
          </div>

          {/* Package Status Badge */}
          {getClassStatusBadge()}

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Available Sessions
            </h3>
          {cls.sessions.map((sess) => {
            const isFullyBooked = sess.bookingCount >= sess.capacity;
            const availableSlots = sess.capacity - sess.bookingCount;

            return (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 capitalize">
                      {sess.timeSlot}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        availableSlots > 5
                          ? "bg-green-100 text-green-800"
                          : availableSlots > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {availableSlots} slots left
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeSlotDisplay(sess.timeSlot)}
                  </p>
                </div>
                <button
                  onClick={() => handleBookNow(sess.id)}
                  disabled={mutation.isPending || isFullyBooked}
                  className={`ml-4 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    mutation.isPending || isFullyBooked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : !hasActiveSubscription
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm"
                      : cls.requiresUpgrade
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  }`}
                >
                  {mutation.isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Booking...
                    </span>
                  ) : isFullyBooked ? (
                    "Full"
                  ) : !hasActiveSubscription ? (
                    "Select Package"
                  ) : cls.requiresUpgrade ? (
                    "Upgrade to Book"
                  ) : (
                    "Book Now"
                  )}
                </button>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}