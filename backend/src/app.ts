import express from "express";
import cors from "cors";

const app = express();

// Enable CORS for all origins 
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

export default app;
