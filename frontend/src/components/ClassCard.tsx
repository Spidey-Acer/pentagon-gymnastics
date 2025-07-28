import { useMutation } from "@tanstack/react-query";
import api from "../services/api";

interface ClassCardProps {
  cls: { id: number; name: string; description: string; sessions: any[] };
}

export default function ClassCard({ cls }: ClassCardProps) {
  const mutation = useMutation((sessionId: number) =>
    api.post("/sessions/book", { sessionId })
  );

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl">{cls.name}</h2>
      <p>{cls.description}</p>
      <ul>
        {cls.sessions.map((sess) => (
          <li key={sess.id}>
            {sess.timeSlot} - Slots: {sess.capacity - sess.bookings}
            <button
              onClick={() => mutation.mutate(sess.id)}
              className="ml-2 bg-green-500 text-white p-1"
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
