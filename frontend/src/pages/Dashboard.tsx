import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import Recommendation from "../components/Recommendation";
import { useState } from "react";

export default function Dashboard() {
  const [userPreferences] = useState<number[]>([0.5, 0.7]);
  const { data: bookedSessions, isLoading } = useQuery({
    queryKey: ["bookedSessions"],
    queryFn: () => api.get("/sessions/booked").then((res) => res.data),
  });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Your Booked Sessions</h2>
        {bookedSessions?.length ? (
          <ul className="list-disc pl-5">
            {bookedSessions.map((booking: any) => (
              <li key={booking.id}>
                {booking.session.class.name} - {booking.session.timeSlot}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet. Explore classes!</p>
        )}
      </section>
      <section>
        <Recommendation userPreferences={userPreferences} />
      </section>
    </div>
  );
}
