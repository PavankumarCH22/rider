// Uber, Ola and Rapido don't expose public pricing APIs, so real products in this
// space get fares by scraping each app or via limited partner deals (see the app's
// README for that trade-off). This engine simulates realistic fares from published
// base-fare/per-km structures plus randomized surge, so the app is fully demoable
// without third-party credentials. Swap `estimateFare` for real calls once you have
// provider access.

const PROVIDERS = {
  uber: { label: "Uber", base: 45, perKm: 13, perMin: 1.8, surgeRange: [1.0, 1.6] },
  ola: { label: "Ola", base: 40, perKm: 12, perMin: 1.6, surgeRange: [1.0, 1.5] },
  rapido: { label: "Rapido", base: 25, perKm: 9, perMin: 1.2, surgeRange: [1.0, 1.3] },
  nammaYatri: { label: "Namma Yatri", base: 30, perKm: 10.5, perMin: 1.3, surgeRange: [1.0, 1.1] },
};

const RIDE_TYPE_MULTIPLIER = {
  bike: 0.45,
  auto: 0.7,
  car: 1,
  suv: 1.5,
};

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function estimateFares({ distanceKm, rideType = "car", seed = Date.now() }) {
  const durationMin = Math.max(5, Math.round(distanceKm * 2.5));
  const typeMultiplier = RIDE_TYPE_MULTIPLIER[rideType] ?? 1;

  const results = Object.entries(PROVIDERS).map(([key, cfg], i) => {
    const rand = seededRandom(seed + i * 7);
    const [minSurge, maxSurge] = cfg.surgeRange;
    const surgeMultiplier = Number((minSurge + rand * (maxSurge - minSurge)).toFixed(2));

    // Bike taxis only make sense for Rapido / Namma Yatri in most cities
    if (rideType === "bike" && !["rapido", "nammaYatri"].includes(key)) {
      return null;
    }

    const rawPrice =
      (cfg.base + cfg.perKm * distanceKm + cfg.perMin * durationMin) *
      typeMultiplier *
      surgeMultiplier;

    const etaMinutes = Math.max(2, Math.round(2 + seededRandom(seed + i * 13) * 8));

    return {
      provider: cfg.label,
      providerKey: key,
      rideType,
      price: Math.round(rawPrice),
      etaMinutes,
      surgeMultiplier,
    };
  });

  const fares = results.filter(Boolean).sort((a, b) => a.price - b.price);
  const cheapest = fares[0] ?? null;
  const fastest = [...fares].sort((a, b) => a.etaMinutes - b.etaMinutes)[0] ?? null;

  return { distanceKm, durationMin, fares, cheapest, fastest };
}
