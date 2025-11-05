import { z } from "zod";

export const JobSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1).optional().default("Remote"),
  url: z.string().url().optional(),
  createdAt: z.string().optional()
});

export type Job = z.infer<typeof JobSchema>;

export const JobArraySchema = z.array(JobSchema);
