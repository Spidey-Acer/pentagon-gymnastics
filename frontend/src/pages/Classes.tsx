import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import ClassCard from "../components/ClassCard";

export default function Classes() {
  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: () => api.get("/classes").then((res) => res.data),
  });

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Fitness Classes</h1>
          <p className="mt-2 text-gray-600">
            Choose from our diverse selection of fitness classes designed to
            help you achieve your goals
          </p>
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
 