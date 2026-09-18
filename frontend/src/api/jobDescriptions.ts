import type { JobDescription } from "../types";
import { api } from "./client";

export async function listJobDescriptions(): Promise<JobDescription[]> {
  const data = await api<{ items: JobDescription[] }>("/job-descriptions");
  return data.items;
}

export function getJobDescription(id: number): Promise<JobDescription> {
  return api<JobDescription>(`/job-descriptions/${id}`);
}

export function createJobDescription(payload: {
  title?: string;
  description_text: string;
}): Promise<JobDescription> {
  return api<JobDescription>("/job-descriptions", {
    method: "POST",
    body: JSON.stringify({
      title: payload.title || null,
      description_text: payload.description_text,
    }),
  });
}

export function deleteJobDescription(id: number): Promise<void> {
  return api<void>(`/job-descriptions/${id}`, { method: "DELETE" });
}
