# FareBoard — MERN ride-fare comparison app

Compares Uber, Ola, Rapido and Namma Yatri fares for a trip and highlights the
cheapest and fastest options side by side.

## Stack
- **M**ongoDB (via Mongoose) — stores recent searches, optional
- **E**xpress — REST API
- **R**eact (Vite + Tailwind) — frontend
- **N**ode.js — server runtime

## Important: about the pricing data

Uber, Ola and Rapido don't publish public pricing APIs. Real comparison apps
get around this by scraping each provider's app or negotiating limited
partner access — both come with maintenance and legal tradeoffs (see
`backend/utils/fareEngine.js` for notes). This project ships with a
**realistic mock pricing engine** (base fare + per-km + per-min + randomized
surge, based on each provider's published fare structure) so you can run and
demo the full app immediately. Swap `estimateFares()` for real provider calls
once you have API/scraping access.

## Project structure
```
mern-ride-compare/
├── backend/
│   ├── config/db.js
│   ├── controllers/fareController.js
│   ├── models/SearchHistory.js
│   ├── routes/fareRoutes.js
│   ├── utils/fareEngine.js       # mock pricing logic — replace with real APIs later
│   └── server.js
└── frontend/
    └── src/
        ├── api/fareApi.js
        ├── components/{SearchForm,FareCard,FareResults}.jsx
        └── App.jsx
```

## Core Features (Premium Makeover)

- **3D Animated Scooter Loader:** A custom, 3D CSS-animated Vespa-style scooter taxi. The wheels spin, the chassis tilts and bounces dynamically inside a 3D perspective box, and speed trails flash past to make wait times visually engaging.
- **Dynamic Accent Color Customizer:** 5 pre-configured accent color palettes (Gold, Cyan, Purple, Green, Coral). Changing accents updates all button highlights, tab colors, and the 3D loader headlight beam in real-time.
- **Theme-Aware Watermark Background:** A high-visibility responsive sportbike watermark positioned dynamically. It uses custom CSS blending (`screen` for dark mode, `multiply` for light mode) and filters to integrate seamlessly into both themes, featuring an idling vibration and riding sway animation.
- **Sticky Glassmorphism Navigation:** A fixed sticky header with backdrop blur filters for a modern look.
- **Local Network Sharing:** Fully configured local network exposure (`npm run dev` executes `vite --host`) to preview and test the app on mobile devices.

## Run it locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI if you have MongoDB running; optional
npm run dev                # http://localhost:5000
```
The API works even with no MongoDB connection — it just won't save search
history.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```
Vite proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`).

### 3. Try it
Open http://localhost:5173, enter a pickup/drop label and trip distance in
km, pick a ride type, and hit **Compare fares**.

## API

`POST /api/fares/compare`
```json
{ "pickup": "Indiranagar", "drop": "Koramangala", "distanceKm": 7.5, "rideType": "car" }
```
Returns fares from all providers sorted cheapest-first, plus the cheapest and
fastest picks.

`GET /api/fares/history` — last 10 saved searches (empty array if MongoDB isn't connected).

## Next steps for a real product
1. Add geocoding (Google/Mapbox) so users pick real addresses and distance is calculated automatically instead of entered manually.
2. Replace `fareEngine.js` with real provider integrations — either official partner APIs or a scraping service, then cache aggressively since fares change every few minutes.
3. Add deep links to open the chosen provider's app pre-filled with the trip (most ride apps support URL schemes for this).
4. Add auth + saved addresses if you want the "book directly" flow, not just compare.
