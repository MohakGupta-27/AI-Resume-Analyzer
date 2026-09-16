import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAnalyses } from "../api/analyses";
import { getErrorMessage } from "../api/client";
import { listJobDescriptions } from "../api/jobDescriptions";
import { listResumes } from "../api/resumes";
import { Button } from "../components/Button";
import { Card, PageHeader } from "../components/Card";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates";
import { useAuth } from "../context/AuthContext";
import { displayName, formatDate } from "../lib/format";
import type { Analysis, JobDescription, Resume } from "../types";

export function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listResumes(), listAnalyses(), listJobDescriptions()])
      .then(([resumeData, analysisData, jobData]) => {
        if (cancelled) return;
        setResumes(resumeData);
        setAnalyses(analysisData);
        setJobs(jobData);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const latestScore = analyses.find((item) => item.score != null)?.score ?? null;
  const name = user ? displayName(user.full_name, user.email) : "there";

  if (loading) return <LoadingState label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name}`}
        subtitle="Upload a resume, choose a job if you have one, and run an analysis."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/resumes/upload">
              <Button>Upload resume</Button>
            </Link>
            <Link to="/analyze">
              <Button variant="secondary">Start analysis</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resumes" value={String(resumes.length)} />
        <StatCard label="Analyses" value={String(analyses.length)} />
        <StatCard
          label="Latest score"
          value={latestScore == null ? "—" : String(Math.round(latestScore))}
        />
        <StatCard label="Job descriptions" value={String(jobs.length)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Recent resumes</h2>
            <Link to="/resumes" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          {resumes.length === 0 ? (
            <EmptyState
              title="No resumes yet"
              description="Upload a PDF to start analyzing."
              action={
                <Link to="/resumes/upload">
                  <Button>Upload resume</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {resumes.slice(0, 5).map((resume) => (
                <li key={resume.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link to={`/resumes/${resume.id}`} className="truncate font-semibold text-ink">
                      {resume.file_name}
                    </Link>
                    <p className="text-xs text-muted">{formatDate(resume.uploaded_at)}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">
                    {resume.has_extracted_text ? "Ready" : "No text"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Recent analyses</h2>
            <Link to="/analyses" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          {analyses.length === 0 ? (
            <EmptyState
              title="No analyses yet"
              description="Run your first analysis to see scores and skill gaps here."
              action={
                <Link to="/analyze">
                  <Button>Analyze a resume</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {analyses.slice(0, 5).map((analysis) => {
                const resume = resumes.find((item) => item.id === analysis.resume_id);
                return (
                  <li key={analysis.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link to={`/analyses/${analysis.id}`} className="truncate font-semibold text-ink">
                        {resume?.file_name ?? `Resume #${analysis.resume_id}`}
                      </Link>
                      <p className="text-xs text-muted">{formatDate(analysis.created_at)}</p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-brand">
                      {analysis.score == null ? "—" : Math.round(analysis.score)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
    </Card>
  );
}
