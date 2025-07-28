// Mock class vectors (0-1 scale for features like intensity, flexibility)
const classVectors: { [key: string]: number[] } = {
  Yoga: [0.2, 0.9], // low intensity, high flexibility
  Spin: [0.8, 0.3],
  // Add others...
};

export function recommendClasses(userPrefs: number[]): string[] {
  // Simple cosine similarity
  const similarities: { name: string; score: number }[] = [];
  Object.entries(classVectors).forEach(([name, vec]) => {
    const dot = userPrefs.reduce((sum, p, i) => sum + p * vec[i], 0);
    const magUser = Math.sqrt(userPrefs.reduce((sum, p) => sum + p ** 2, 0));
    const magVec = Math.sqrt(vec.reduce((sum, v) => sum + v ** 2, 0));
    const score = dot / (magUser * magVec);
    similarities.push({ name, score });
  });
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.name);
}
