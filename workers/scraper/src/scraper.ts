import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JobArraySchema } from "@autojobops/core";

const REMOTE_OK_URL = process.env.REMOTEOK_URL ?? "https://remoteok.com/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../../../data/jobs.json");

async function scrapeRemoteOk() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(REMOTE_OK_URL, { waitUntil: "networkidle" });

  const jobs = await page.$$eval("tr.job", (rows) => {
    return rows
      .map((row) => {
        const title = row.querySelector("h2")?.textContent?.trim() ?? "";
        const company = row.querySelector("h3")?.textContent?.trim() ?? "";
        const location = row.querySelector("div.location")?.textContent?.trim() ?? "Remote";
        const relativeLink = row.getAttribute("data-url") ?? row.querySelector("a.preventLink")?.getAttribute("href") ?? "";
        const url = relativeLink ? new URL(relativeLink, "https://remoteok.com").toString() : undefined;

        return {
          title,
          company,
          location,
          url
        };
      })
      .filter((job) => job.title && job.company);
  });

  await browser.close();

  const parsed = JobArraySchema.parse(jobs);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(parsed, null, 2), "utf8");
  console.log(`Saved ${parsed.length} jobs to ${outputPath}`);
}

scrapeRemoteOk().catch((error) => {
  console.error("Scraping failed", error);
  process.exit(1);
});
