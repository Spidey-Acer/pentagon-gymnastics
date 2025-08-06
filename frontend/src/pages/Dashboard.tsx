import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import Recommendation from "../components/Recommendation";
import PackageSelectionModal from "../components/PackageSelectionModal";
import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useSubscription } from "../hooks/useSubscription";

interface BookingData {
  id: number;
  session: {
    id: number;
    class: {
      name: string;
    };
    timeSlot: string;
  };
}

export default function Dashboard() {
  const [userPreferences] = useState<number[]>([0.5, 0.7]);
  const [selectedBookings, setSelectedBookings] = useState<Set<number>>(
    new Set()
  );
  const [showPackageModal, setShowPackageModal] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess, showError, showWarning } = useToast();
  
  // Use the subscription hook for consistent state management
  const { subscription: userSubscription, hasActiveSubscription } = useSubscription();

  const {
    data: bookedSessions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookedSessions"],
    queryFn: () => api.get("/sessions/booked").then((res) => res.data),
    refetchInterval: 2000, // Auto-refresh every 2 seconds
    refetchIntervalInBackground: true, // Continue refreshing in background
  });

  // Show package selection modal if user has no active subscription
  useEffect(() => {
    if (!hasActiveSubscription) {
      setShowPackageModal(true);
    }
  }, [hasActiveSubscription]);

  // Additional manual refresh on component mount and periodic intervals
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [refetch]);

  const clearAllBookingsMutation = useMutation({
    mutationFn: () => api.delete("/sessions/clear-bookings"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookedSessions"] });
      setSelectedBookings(new Set());
      showSuccess("Bookings Cleared", "All bookings cleared successfully!");
    },
    onError: (error) => {
      console.error("Error clearing bookings:", error);
      showError("Clear Failed", "Failed to clear bookings. Please try again.");
    },
  });

  const clearSelectedBookingsMutation = useMutation({
    mutationFn: (bookingIds: number[]) =>
      Promise.all(
        bookingIds.map((id) => api.delete(`/sessions/bookings/${id}`))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookedSessions"] });
      setSelectedBookings(new Set());
      showSuccess(
        "Selected Cleared",
        "Selected bookings cleared successfully!"
      );
    },
    onError: (error) => {
      console.error("Error clearing selected bookings:", error);
      showError(
        "Clear Failed",
        "Failed to clear selected bookings. Please try again."
      );
    },
  });

  const handleClearAllBookings = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your booked sessions? This action cannot be undone."
      )
    ) {
      clearAllBookingsMutation.mutate();
    }
  };

  const handleClearSelectedBookings = () => {
    if (selectedBookings.size === 0) {
      showWarning("No Selection", "Please select bookings to clear.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to clear ${selectedBookings.size} selected booking(s)? This action cannot be undone.`
      )
    ) {
      clearSelectedBookingsMutation.mutate(Array.from(selectedBookings));
    }
  };

  const handleBookingSelection = (bookingId: number) => {
    const newSelection = new Set(selectedBookings);
    if (newSelection.has(bookingId)) {
      newSelection.delete(bookingId);
    } else {
      newSelection.add(bookingId);
    }
    setSelectedBookings(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === bookedSessions?.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(
        new Set(bookedSessions?.map((booking: BookingData) => booking.id) || [])
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <>
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        isRequired={!userSubscription}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Manage your fitness journey
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Auto-refreshing every 2s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booked Sessions Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Your Booked Sessions
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {bookedSessions?.length || 0} active bookings
                        {selectedBookings.size > 0 &&
                          ` • ${selectedBookings.size} selected`}
                      </p>
                    </div>
                    {bookedSessions?.length > 0 && (
                      <div className="flex space-x-2">
                        {selectedBookings.size > 0 && (
                          <button
                            onClick={handleClearSelectedBookings}
                            disabled={clearSelectedBookingsMutation.isPending}
                            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm shadow-sm"
                          >
                            {clearSelectedBookingsMutation.isPending
                              ? "Clearing..."
                              : `Clear Selected (${selectedBookings.size})`}
                          </button>
                        )}
                        <button
                          onClick={handleClearAllBookings}
                          disabled={clearAllBookingsMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm shadow-sm"
                        >
                          {clearAllBookingsMutation.isPending ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Clearing...
                            </span>
                          ) : (
                            "Clear All"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {bookedSessions?.length > 0 && (
                    <div className="mt-4 flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedBookings.size === bookedSessions?.length
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Select All ({bookedSessions?.length})
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {bookedSessions?.length ? (
                    <div className="space-y-4">
                      {bookedSessions.map((booking: BookingData) => (
                        <div
                          key={booking.id}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
                            selectedBookings.has(booking.id)
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={selectedBookings.has(booking.id)}
                              onChange={() =>
                                handleBookingSelection(booking.id)
                              }
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {booking.session.class.name}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {booking.session.timeSlot} Session
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Booked
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No bookings yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start your fitness journey by exploring our classes!
                      </p>
                      <div className="mt-6">
                        <a
                          href="/classes"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Browse Classes
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recommended for You
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your preferences
                  </p>
                </div>
                <div className="p-6">
                  <Recommendation userPreferences={userPreferences} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
