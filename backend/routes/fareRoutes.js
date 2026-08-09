import { Router } from "express";
import { compareFares, getHistory } from "../controllers/fareController.js";

const router = Router();

router.post("/compare", compareFares);
router.get("/history", getHistory);

export default router;
