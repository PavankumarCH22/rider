import { Router } from "express";
import { getAiSuggestion } from "../controllers/aiController.js";

const router = Router();

// Expects body: { origin, destination, distanceKm, rideType, fares }
router.post("/suggest", getAiSuggestion);

export default router;
