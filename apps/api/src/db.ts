import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Job, JobArraySchema } from "@autojobops/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../../data/app.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.prepare(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`).run();

export function getJobs(): Job[] {
  const rows = db
    .prepare("SELECT id, title, company, location, url, created_at as createdAt FROM jobs ORDER BY created_at DESC")
    .all();
  return rows as Job[];
}

export function insertJobs(jobs: unknown): Job[] {
  const parsed = JobArraySchema.parse(jobs);
  const insert = db.prepare(
    "INSERT INTO jobs (title, company, location, url) VALUES (@title, @company, @location, @url)"
  );
  const transaction = db.transaction((items: Job[]) => {
    for (const job of items) {
      insert.run({
        title: job.title,
        company: job.company,
        location: job.location ?? "Remote",
        url: job.url ?? null
      });
    }
  });
  transaction(parsed);
  return getJobs();
}
