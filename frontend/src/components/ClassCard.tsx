import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface ClassCardProps {
  cls: { id: number; name: string; description: string; sessions: any[] };
}

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
    onError: (error: any) => {
      alert(
        `Booking failed: ${error.response?.data?.error || "Unknown error"}`
      );
    },
  });

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl">{cls.name}</h2>
      <p>{cls.description}</p>
      <ul>
        {cls.sessions.map((sess) => (
          <li key={sess.id} className="flex items-center space-x-2">
            <span>
              {sess.timeSlot} - Slots: {sess.capacity - sess.bookingCount}
            </span>
            <button
              onClick={() => mutation.mutate(sess.id)}
              disabled={
                mutation.isPending || sess.bookingCount >= sess.capacity
              }
              className={`ml-2 p-1 text-white ${
                mutation.isPending || sess.bookingCount >= sess.capacity
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {mutation.isPending ? "Booking..." : "Book"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
