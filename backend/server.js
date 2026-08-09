import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import fareRoutes from "./routes/fareRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/fares", fareRoutes);
import aiRouter from "./routes/ai.js";
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 5003;

connectDB().finally(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
