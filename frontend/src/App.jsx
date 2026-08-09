import { useState, useEffect } from "react";
import AiSuggestion from "./components/AiSuggestion.jsx";
import { getAiSuggestion } from "./api/aiApi.js";
import SearchForm from "./components/SearchForm.jsx";
import FareResults from "./components/FareResults.jsx";
import { compareFares } from "./api/fareApi.js";
import { Sun, Moon, Info } from "lucide-react";

import ProviderMap from "./components/ProviderMap.jsx";
import { providers } from "./components/ProvidersData.jsx";

const ACCENT_PRESETS = [
  { name: "Gold", value: "#FFC845" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Purple", value: "#A78BFA" },
  { name: "Green", value: "#2FD9A8" },
  { name: "Coral", value: "#FF6B5E" }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  // initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accent-color') || '#FFC845';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor);
    localStorage.setItem('accent-color', accentColor);
  }, [accentColor]);

  const [data, setData] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  // New state for map and AI
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideType, setRideType] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");

  // Get live device location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  async function handleSearch(params) {
    setLoading(true);
    setError(null);
    try {
      const result = await compareFares(params);
      setData(result);
      setDistanceKm(params.distanceKm);
      // Set origin, destination, ride type for map and AI
      setOrigin(params.pickup);
      setDestination(params.drop);
      setRideType(params.rideType);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data && origin && destination) {
      const fetchSuggestion = async () => {
        try {
          const suggestion = await getAiSuggestion({
            origin,
            destination,
            distanceKm,
            rideType,
            fares: data.fares,
          });
          setAiSuggestion(suggestion);
        } catch (err) {
          console.error('AI suggestion error:', err);
        }
      };
      fetchSuggestion();
    }
  }, [data, origin, destination]);

  return (
    <div className="min-h-screen relative">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-40"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(255,200,69,0.08), transparent)" }}
      />

      {/* Watermark Background Chopper Image */}
      <div 
        className="fixed inset-0 pointer-events-none select-none z-0 bg-no-repeat transition-all duration-500 animate-chopper"
        style={{ 
          backgroundImage: "url('/background-bike.jpg')",
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
          filter: theme === 'dark' ? 'invert(0.9) brightness(1.5) contrast(1.1)' : 'brightness(1.05) contrast(0.85)',
          opacity: theme === 'dark' ? 0.35 : 0.45,
          backgroundPosition: 'right 5% bottom 5%',
          backgroundSize: 'clamp(280px, 45vw, 600px)'
        }}
      />

      <header className="sticky top-0 z-40 bg-panel/80 backdrop-blur-md border-b border-panelLine/60 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="font-display font-semibold tracking-wide">FareBoard</span>
          </div>
          <span className="hidden sm:block text-[11px] text-muted font-mono tracking-wider">
            UBER · OLA · RAPIDO · NAMMA YATRI
          </span>
          <div className="flex items-center gap-3">
            {/* Accent Color Circles */}
            <div className="flex items-center gap-1.5 border border-panelLine bg-panel px-2.5 py-1.5 rounded-xl">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setAccentColor(preset.value)}
                  className="h-4 w-4 rounded-full border border-panelLine transition-all duration-300 hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  style={{ 
                    backgroundColor: preset.value,
                    borderColor: accentColor === preset.value ? 'var(--color-paper)' : 'transparent',
                    boxShadow: accentColor === preset.value ? `0 0 8px ${preset.value}` : 'none'
                  }}
                  title={`${preset.name} Accent`}
                  aria-label={`Set ${preset.name} Accent`}
                />
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-panelLine bg-panel hover:bg-panelLine/40 transition-transform duration-300 active:scale-95 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-yellow-400 transition-transform duration-500 group-hover:rotate-90" />
              ) : (
                <Moon size={18} className="text-indigo-400 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-6 py-10 z-10">
        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
          <ProviderMap providers={providers} apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} origin={origin} destination={destination} userLocation={userLocation} />
        ) : (
          <div className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-panel border border-panelLine/60 text-xs text-muted select-none">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>Google Maps API key not configured. Ride maps will not be displayed.</span>
          </div>
        )}
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-display mb-3 animate-fade-up">
          One board, every fare
        </p>
        <h1
          className="font-display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] text-paper mb-3 animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Check every ride app before you tap book.
        </h1>
        <p className="text-muted max-w-xl mb-10 animate-fade-up" style={{ animationDelay: "120ms" }}>
          Enter your trip once — FareBoard lines up prices from four ride apps
          side by side, like a departure board, so the cheapest fare is
          obvious at a glance.
        </p>

        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && <p className="mt-6 text-surge font-mono text-sm">{error}</p>}

        <FareResults data={data} loading={loading} distanceKm={distanceKm} />
        <AiSuggestion suggestion={aiSuggestion} />
      </main>

      <footer className="relative max-w-3xl mx-auto px-6 py-10 text-xs text-muted flex items-center justify-center gap-2 border-t border-panelLine mt-6">
        <Info size={14} className="text-accent shrink-0" />
        <span>Fares shown are estimates from a demo pricing engine, not live provider data.</span>
      </footer>
    </div>
  );
}
