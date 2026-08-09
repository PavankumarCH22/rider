import { useState } from "react";
import { ArrowUpDown, Bike, Car, CarFront, Truck } from "lucide-react";

const RIDE_TYPES = [
  { value: "bike", label: "Bike", Icon: Bike },
  { value: "auto", label: "Auto", Icon: CarFront },
  { value: "car", label: "Car", Icon: Car },
  { value: "suv", label: "SUV", Icon: Truck },
];
const DISTANCE_PRESETS = [2, 5, 10, 18];

export default function SearchForm({ onSearch, loading }) {
  const [pickup, setPickup] = useState("Indiranagar");
  const [drop, setDrop] = useState("Koramangala");
  const [distanceKm, setDistanceKm] = useState(7.5);
  const [rideType, setRideType] = useState("car");

  function handleSubmit(e) {
    e.preventDefault();
    if (!pickup || !drop || !distanceKm || Number(distanceKm) <= 0) return;
    onSearch({ pickup, drop, distanceKm: Number(distanceKm), rideType });
  }

  function swap() {
    setPickup(drop);
    setDrop(pickup);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-panel border border-panelLine rounded-2xl p-6 md:p-8 grid gap-5 animate-fade-up"
    >
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-2 items-end">
        <Field label="Pickup">
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className="input"
          />
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap pickup and drop"
          title="Swap pickup and drop"
          className="flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-full bg-ink border border-panelLine text-muted transition-all duration-300 hover:text-paper hover:rotate-180 mx-auto md:mx-0 self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:scale-95 z-10"
        >
          <ArrowUpDown size={16} />
        </button>

        <Field label="Drop">
          <input
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="Drop location"
            className="input"
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Distance">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.5"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="input font-mono w-full"
              />
              <span className="text-sm text-muted shrink-0">km</span>
            </div>
            <div className="flex gap-1.5">
              {DISTANCE_PRESETS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDistanceKm(d)}
                  className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                    Number(distanceKm) === d
                      ? "bg-accent text-ink border-accent"
                      : "border-panelLine text-muted hover:text-paper"
                  }`}
                >
                  {d}km
                </button>
              ))}
            </div>
          </div>
        </Field>

        <Field label="Ride type">
          <div className="grid grid-cols-4 gap-2">
            {RIDE_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setRideType(t.value)}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-display font-semibold transition-all ${
                  rideType === t.value
                    ? "bg-accent text-ink"
                    : "bg-ink text-muted border border-panelLine hover:text-paper"
                }`}
              >
                <t.Icon size={16} strokeWidth={2.2} />
                {t.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="justify-self-start bg-accent text-ink font-display font-semibold px-6 py-3 rounded-xl hover:brightness-95 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-wait"
      >
        {loading ? "Checking fares…" : "Compare fares"}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted font-display">
        {label}
      </span>
      {children}
    </label>
  );
}
