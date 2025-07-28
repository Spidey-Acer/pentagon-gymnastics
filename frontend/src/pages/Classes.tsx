import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import ClassCard from "../components/ClassCard";

export default function Classes() {
  const { data: classes } = useQuery(["classes"], () =>
    api.get("/classes").then((res) => res.data)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {classes?.map((cls: any) => (
        <ClassCard key={cls.id} cls={cls} />
      ))}
    </div>
  );
}
