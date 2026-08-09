export async function getAiSuggestion({ origin, destination, distanceKm, rideType, fares }) {
  const response = await fetch('/api/ai/suggest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, destination, distanceKm, rideType, fares }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error('AI suggestion failed: ' + err);
  }
  const data = await response.json();
  return data.suggestion;
}
