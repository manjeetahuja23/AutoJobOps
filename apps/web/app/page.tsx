import Link from "next/link";
import { Job, JobArraySchema } from "@autojobops/core";

async function fetchJobs(): Promise<Job[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/jobs`, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Failed to load jobs: ${res.status}`);
    return [];
  }
  const json = await res.json();
  const parsed = JobArraySchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return [];
  }
  return parsed.data;
}

export default async function HomePage() {
  const jobs = await fetchJobs();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest Jobs</h2>
        <Link
          href="/jobs"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-700"
        >
          View all
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                  No jobs available. Run the scraper or add jobs via the API.
                </td>
              </tr>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <tr key={job.id ?? `${job.title}-${job.company}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{job.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{job.company}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{job.location ?? "Remote"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
