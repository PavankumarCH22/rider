import { useState } from "react";
import { TrendingDown } from "lucide-react";
import FareCard from "./FareCard.jsx";
import FareCardSkeleton from "./FareCardSkeleton.jsx";
import BikeAnimation from "./BikeAnimation.jsx";

export default function FareResults({ data, loading, distanceKm }) {
  const [sortBy, setSortBy] = useState("price");

  if (loading) {
    return (
      <div className="mt-8 grid gap-6 animate-fade-up">
        <BikeAnimation />
        <div className="grid gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <FareCardSkeleton key={i} delay={i * 80} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { fares, cheapest, fastest, durationMin } = data;
  const maxPrice = fares.length ? Math.max(...fares.map((f) => f.price)) : 1;
  const priciest = fares.length > 1 ? [...fares].sort((a, b) => b.price - a.price)[0] : null;
  const savings = priciest ? priciest.price - cheapest.price : 0;

  const sortedFares = [...fares].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : a.etaMinutes - b.etaMinutes
  );

  return (
    <div className="mt-8 grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-paper">
          {fares.length} fares for {distanceKm} km · ~{durationMin} min
        </h2>

        <div className="flex items-center gap-3">
          {savings > 0 && (
            <p className="flex items-center gap-1 text-sm text-savings font-mono">
              <TrendingDown size={14} /> up to ₹{savings} cheaper
            </p>
          )}
          <div className="flex text-xs rounded-full overflow-hidden border border-panelLine">
            {[
              { key: "price", label: "Cheapest" },
              { key: "eta", label: "Fastest" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 transition-colors ${
                  sortBy === opt.key ? "bg-panelLine text-paper" : "text-muted hover:text-paper"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 pt-2">
        {sortedFares.map((fare, i) => (
          <div key={fare.providerKey} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <FareCard
              fare={fare}
              rank={i + 1}
              maxPrice={maxPrice}
              isCheapest={fare.providerKey === cheapest?.providerKey}
              isFastest={fare.providerKey === fastest?.providerKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
