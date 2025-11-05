import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { getJobs, insertJobs } from "./db";

const app = express();
const PORT = Number(process.env.API_PORT ?? 4000);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: false
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/jobs", (_req, res) => {
  const jobs = getJobs();
  res.json(jobs);
});

app.post("/jobs", (req, res, next) => {
  try {
    const jobs = insertJobs(req.body);
    res.status(201).json(jobs);
  } catch (error) {
    next(error);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
});

app.listen(PORT, () => {
  console.log(`API server ready on http://localhost:${PORT}`);
});
