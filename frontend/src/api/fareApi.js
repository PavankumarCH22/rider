const BASE_URL = "/api/fares";

export async function compareFares({ pickup, drop, distanceKm, rideType }) {
  const res = await fetch(`${BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pickup, drop, distanceKm, rideType }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to compare fares");
  }
  return res.json();
}
