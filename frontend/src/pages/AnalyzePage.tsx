import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAnalysis } from "../api/analyses";
import { getErrorMessage } from "../api/client";
import { listJobDescriptions } from "../api/jobDescriptions";
import { listResumes } from "../api/resumes";
import { Button } from "../components/Button";
import { Card, PageHeader } from "../components/Card";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates";
import type { JobDescription, Resume } from "../types";

export function AnalyzePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId") ?? "");
  const [jobId, setJobId] = useState(searchParams.get("jobId") ?? "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listResumes(), listJobDescriptions()])
      .then(([resumeData, jobData]) => {
        setResumes(resumeData);
        setJobs(jobData);
      })
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const selectedResume = Number(resumeId);
    if (!Number.isInteger(selectedResume) || selectedResume <= 0) {
      setError("Choose a resume to analyze.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const analysis = await createAnalysis({
        resume_id: selectedResume,
        job_description_id: jobId ? Number(jobId) : null,
      });
      navigate(`/analyses/${analysis.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Loading analysis options…" />;

  if (resumes.length === 0) {
    return (
      <EmptyState
        title="Upload a resume first"
        description="Analysis needs extracted resume text from a PDF upload."
        action={
          <Button onClick={() => navigate("/resumes/upload")}>Upload resume</Button>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Start analysis"
        subtitle="Select a resume. A job description is optional — without one, you still get a general resume review."
      />
      <Card className="mx-auto max-w-xl">
        <form className="space-y-4" onSubmit={onSubmit}>
          {error ? <ErrorState message={error} /> : null}
          {submitting ? (
            <LoadingState label="Analyzing resume with AI. This can take a few seconds…" />
          ) : null}
          <label className="block" htmlFor="resume_id">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Resume</span>
            <select
              id="resume_id"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
              value={resumeId}
              disabled={submitting}
              onChange={(event) => setResumeId(event.target.value)}
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id} disabled={!resume.has_extracted_text}>
                  {resume.file_name}
                  {resume.has_extracted_text ? "" : " (no extracted text)"}
                </option>
              ))}
            </select>
          </label>
          <label className="block" htmlFor="job_description_id">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              Job description (optional)
            </span>
            <select
              id="job_description_id"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
              value={jobId}
              disabled={submitting}
              onChange={(event) => setJobId(event.target.value)}
            >
              <option value="">General resume review</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title?.trim() || `Job #${job.id}`}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Analyzing…" : "Run analysis"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
