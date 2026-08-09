import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles } from "lucide-react";

const PROVIDER_DOT = {
  Uber: "bg-paper",
  Ola: "bg-yellow-300",
  Rapido: "bg-orange-400",
  "Namma Yatri": "bg-emerald-400",
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const duration = 500;
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

export default function FareCard({ fare, rank, maxPrice, isCheapest, isFastest }) {
  const barPct = maxPrice > 0 ? (fare.price / maxPrice) * 100 : 0;

  return (
    <div
      className={`relative flex items-center gap-4 rounded-xl border bg-panel px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-accent/40 ${
        isCheapest ? "border-accent shadow-[0_0_20px_rgba(var(--color-accent),0.05)]" : "border-panelLine"
      }`}
    >
      {isCheapest && (
        <span className="absolute -top-3 right-4 flex items-center gap-1 rotate-[-2deg] bg-accent text-ink text-[10px] font-display font-bold tracking-widest px-2.5 py-1 rounded-md shadow-sm">
          <Sparkles size={11} strokeWidth={2.5} /> BEST FARE
        </span>
      )}

      <span className="w-5 text-center text-muted font-mono text-sm">{rank}</span>

      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${PROVIDER_DOT[fare.provider] || "bg-muted"}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display font-semibold text-paper text-base">{fare.provider}</p>
          {isFastest && (
            <span className="text-[10px] font-mono text-savings bg-savings/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Fastest
            </span>
          )}
        </div>
        <p className="text-xs text-muted mt-1 flex items-center gap-2 flex-wrap">
          <Clock size={12} className="inline -mt-px" />
          <span>{fare.etaMinutes} min away</span>
          {fare.surgeMultiplier > 1.15 && (
            <span className="text-surge bg-surge/10 px-1.5 py-0.5 rounded text-[10px] font-semibold">
              {fare.surgeMultiplier}x surge
            </span>
          )}
        </p>
        <div className="mt-3 h-1 w-full rounded-full bg-ink overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${isCheapest ? "bg-accent" : "bg-panelLine"}`}
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-mono text-2xl font-bold text-paper tabular-nums">
          ₹<AnimatedNumber value={fare.price} />
        </p>
        <p className="text-[10px] text-muted font-mono mt-0.5">estimated</p>
      </div>
    </div>
  );
}
