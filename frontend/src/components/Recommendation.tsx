import { useEffect, useState } from "react";
import { recommendClasses } from "../utils/recommender";

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
    <div className="space-y-4">
      {recs.length > 0 ? (
        <div className="space-y-3">
          {recs.map((rec, index) => (
            <div
              key={rec}
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <span className="text-2xl">{getClassIcon(rec)}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{rec}</h4>
                <p className="text-xs text-gray-500">
                  Recommendation #{index + 1}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Perfect Match
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm text-gray-500">No recommendations available</p>
          <p className="text-xs text-gray-400 mt-1">
            Try booking some classes to get personalized recommendations
          </p>
        </div>
      )}
    </div>
  );
}
