import express from "express";
import cors from "cors";
import calculationRoutes from "./routes/calculationRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// API routes
app.use("/api/calculations", calculationRoutes);

app.use(errorHandler);

export default app;
