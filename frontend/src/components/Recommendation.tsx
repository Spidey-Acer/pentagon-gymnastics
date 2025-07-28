import { useEffect, useState } from "react";
import { recommendClasses } from "../utils/recommender";

export default function Recommendation({
  userPreferences,
}: {
  userPreferences: number[];
}) {
  const [recs, setRecs] = useState<string[]>([]);

  useEffect(() => {
    const recommendations = recommendClasses(userPreferences);
    setRecs(recommendations);
  }, [userPreferences]);

  return (
    <div>
      <h3>Recommended Classes:</h3>
      <ul>
        {recs.map((rec) => (
          <li key={rec}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
