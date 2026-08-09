import mongoose from "mongoose";

const fareResultSchema = new mongoose.Schema(
  {
    provider: String,
    rideType: String,
    price: Number,
    etaMinutes: Number,
    surgeMultiplier: Number,
  },
  { _id: false }
);

const searchHistorySchema = new mongoose.Schema(
  {
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    rideType: { type: String, required: true },
    results: [fareResultSchema],
    cheapestProvider: String,
  },
  { timestamps: true }
);

export default mongoose.model("SearchHistory", searchHistorySchema);
