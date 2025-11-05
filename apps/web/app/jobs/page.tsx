import { Job, JobArraySchema } from "@autojobops/core";

async function fetchAllJobs(): Promise<Job[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/jobs`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  const parsed = JobArraySchema.safeParse(json);
  return parsed.success ? parsed.data : [];
}

export default async function JobsPage() {
  const jobs = await fetchAllJobs();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">All Jobs</h2>
        <p className="text-sm text-slate-600">{jobs.length} job{jobs.length === 1 ? "" : "s"} found.</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                  No jobs available yet.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id ?? `${job.title}-${job.company}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{job.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{job.company}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{job.location ?? "Remote"}</td>
                  <td className="px-4 py-3 text-sm">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
