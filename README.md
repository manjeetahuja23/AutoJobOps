# AutoJobOps

AutoJobOps is a minimal pnpm-powered monorepo that exposes a REST API, a Next.js dashboard, and a Playwright-driven scraping worker for gathering remote job listings.

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development stack**

   ```bash
   pnpm run dev
   ```

   This concurrently starts the Express API on port `4000` and the Next.js dashboard on port `3000`.

3. **Scrape new jobs**

   ```bash
   pnpm run scrape
   ```

   The scraper writes results to `data/jobs.json`.

4. **Environment configuration**

   Copy `.env.example` to `.env` inside each workspace if customization is needed.

## Project Layout

- `apps/api` — Express REST API with SQLite persistence.
- `apps/web` — Next.js dashboard that displays jobs from the API.
- `workers/scraper` — Playwright-based scraping worker.
- `packages/core` — Shared types and validation utilities.

## License

MIT © 2025 Manjeet Ahuja
