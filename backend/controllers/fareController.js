import mongoose from "mongoose";
import SearchHistory from "../models/SearchHistory.js";
import { estimateFares } from "../utils/fareEngine.js";

export async function compareFares(req, res) {
  try {
    const { pickup, drop, distanceKm, rideType } = req.body;

    if (!pickup || !drop || !distanceKm) {
      return res.status(400).json({ error: "pickup, drop and distanceKm are required" });
    }
    if (Number(distanceKm) <= 0) {
      return res.status(400).json({ error: "distanceKm must be greater than 0" });
    }

    const { durationMin, fares, cheapest, fastest } = estimateFares({
      distanceKm: Number(distanceKm),
      rideType: rideType || "car",
    });

    // Best-effort save; app still works if MongoDB isn't connected
    if (mongoose.connection.readyState === 1) {
      await SearchHistory.create({
        pickup,
        drop,
        distanceKm,
        rideType: rideType || "car",
        results: fares,
        cheapestProvider: cheapest?.provider,
      });
    }

    res.json({ pickup, drop, distanceKm, durationMin, fares, cheapest, fastest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compare fares" });
  }
}

export async function getHistory(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}
