import { useMutation } from "@tanstack/react-query";
import { Calendar, Clock, Users, Star, BookOpen } from "lucide-react";
import api from "../services/api";

interface ClassCardProps {
  cls: { id: number; name: string; description: string; sessions: any[] };
}

export default function ClassCard({ cls }: ClassCardProps) {
  const mutation = useMutation({
    mutationFn: (sessionId: number) =>
      api.post("/sessions/book", { sessionId }),
  });

  const availableSlots = cls.sessions.reduce(
    (total, sess) => total + (sess.capacity - sess.bookings),
    0
  );

  const getAvailabilityColor = (available: number) => {
    if (available === 0) return "text-red-500";
    if (available <= 2) return "text-orange-500";
    return "text-emerald-500";
  };

  const getAvailabilityBg = (available: number) => {
    if (available === 0) return "bg-red-50 border-red-200";
    if (available <= 2) return "bg-orange-50 border-orange-200";
    return "bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="h-auto group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header section */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-gray-300" />
            </div>
          </div>
          <div className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <Users className="w-3 h-3" />
            <span>{availableSlots} slots</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
          {cls.name}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {cls.description}
        </p>
      </div>

      {/* Sessions section */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-4 h-fit text-indigo-500" />
          <h3 className="font-semibold text-gray-800">Available Sessions</h3>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {cls.sessions.map((sess) => {
            const available = sess.capacity - sess.bookings;
            return (
              <div
                key={sess.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${getAvailabilityBg(
                  available
                )}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {sess.timeSlot}
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${getAvailabilityColor(
                      available
                    )}`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{available}</span>
                    <span className="text-sm opacity-75">left</span>
                  </div>
                </div>

                <button
                  onClick={() => mutation.mutate(sess.id)}
                  disabled={available === 0 || mutation.isPending}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:transform-none disabled:shadow-none ${
                    available === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : mutation.isPending
                      ? "bg-indigo-400 text-white cursor-wait"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  }`}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Booking...</span>
                    </div>
                  ) : available === 0 ? (
                    "Fully Booked"
                  ) : (
                    "Book Session"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full -translate-y-10 translate-x-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400 to-red-500 rounded-full translate-y-8 -translate-x-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
