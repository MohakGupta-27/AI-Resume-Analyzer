import type { Analysis } from "../types";
import { api } from "./client";

export function listAnalyses(): Promise<Analysis[]> {
  return api<Analysis[]>("/analyses");
}

export function listAnalysesForResume(resumeId: number): Promise<Analysis[]> {
  return api<Analysis[]>(`/analyses/resume/${resumeId}`);
}

export function getAnalysis(id: number): Promise<Analysis> {
  return api<Analysis>(`/analyses/${id}`);
}

export function createAnalysis(payload: {
  resume_id: number;
  job_description_id?: number | null;
}): Promise<Analysis> {
  return api<Analysis>("/analyses", {
    method: "POST",
    body: JSON.stringify({
      resume_id: payload.resume_id,
      job_description_id: payload.job_description_id ?? null,
    }),
  });
}
