import type { Resume, ResumeDetail } from "../types";
import { api } from "./client";

export function listResumes(): Promise<Resume[]> {
  return api<Resume[]>("/resumes");
}

export function getResume(id: number): Promise<ResumeDetail> {
  return api<ResumeDetail>(`/resumes/${id}`);
}

export function uploadResume(file: File): Promise<ResumeDetail> {
  const body = new FormData();
  body.append("file", file);
  return api<ResumeDetail>("/resumes/upload", {
    method: "POST",
    body,
  });
}
