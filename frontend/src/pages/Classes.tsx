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
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">
          Error loading classes:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {classes?.map((cls: any) => (
        <ClassCard key={cls.id} cls={cls} />
      ))}
    </div>
  );
}
 