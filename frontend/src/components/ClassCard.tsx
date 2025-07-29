import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

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
  };
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

export default function ClassCard({ cls }: ClassCardProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: number) =>
      api.post("/sessions/book", { sessionId }).then((res) => res.data),
    onSuccess: () => {
      // Invalidate classes query to refresh session data
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      alert("Booking successful!");
    },
    onError: (error: Error | { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Unknown error";
      alert(`Booking failed: ${errorMessage}`);
    },
  });

  return (
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
                  onClick={() => mutation.mutate(sess.id)}
                  disabled={mutation.isPending || isFullyBooked}
                  className={`ml-4 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    mutation.isPending || isFullyBooked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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
  );
}
