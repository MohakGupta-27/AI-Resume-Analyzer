import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAnalyses } from "../api/analyses";
import { getErrorMessage } from "../api/client";
import { listJobDescriptions } from "../api/jobDescriptions";
import { listResumes } from "../api/resumes";
import { Button } from "../components/Button";
import { PageHeader } from "../components/Card";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates";
import { formatDate } from "../lib/format";
import type { Analysis, JobDescription, Resume } from "../types";

export function AnalysisHistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAnalyses(), listResumes(), listJobDescriptions()])
      .then(([analysisData, resumeData, jobData]) => {
        setAnalyses(analysisData);
        setResumes(resumeData);
        setJobs(jobData);
      })
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading analysis history…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader
        title="Analysis history"
        subtitle="Open any previous result. Scores and skills come from the backend, not sample data."
        actions={
          <Link to="/analyze">
            <Button>New analysis</Button>
          </Link>
        }
      />
      {analyses.length === 0 ? (
        <EmptyState
          title="No analyses yet"
          description="After you run an analysis, it will appear here."
          action={
            <Link to="/analyze">
              <Button>Start analysis</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {analyses.map((analysis) => {
            const resume = resumes.find((item) => item.id === analysis.resume_id);
            const job = jobs.find((item) => item.id === analysis.job_description_id);
            return (
              <li
                key={analysis.id}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {resume?.file_name ?? `Resume #${analysis.resume_id}`}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {analysis.job_description_id
                      ? job?.title?.trim() || `Job #${analysis.job_description_id}`
                      : "General review"}
                    {" · "}
                    {formatDate(analysis.created_at)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-lg font-extrabold text-brand">
                    {analysis.score == null ? "—" : Math.round(analysis.score)}
                  </span>
                  <Link to={`/analyses/${analysis.id}`} className="text-sm font-semibold text-brand">
                    View result
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
