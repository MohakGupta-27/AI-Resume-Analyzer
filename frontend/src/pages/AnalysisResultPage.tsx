import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAnalysis } from "../api/analyses";
import { getErrorMessage } from "../api/client";
import { getJobDescription } from "../api/jobDescriptions";
import { getResume } from "../api/resumes";
import { AnalysisScore } from "../components/AnalysisScore";
import { Button } from "../components/Button";
import { Card, PageHeader } from "../components/Card";
import { SkillBadge } from "../components/SkillBadge";
import { ErrorState, LoadingState } from "../components/StatusStates";
import { formatDate } from "../lib/format";
import type { Analysis, JobDescription, Resume } from "../types";

export function AnalysisResultPage() {
  const { id } = useParams();
  const analysisId = Number(id);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(analysisId)) {
      setError("This analysis could not be found.");
      setLoading(false);
      return;
    }

    getAnalysis(analysisId)
      .then(async (data) => {
        setAnalysis(data);
        const resumeData = await getResume(data.resume_id);
        setResume(resumeData);
        if (data.job_description_id) {
          try {
            const jobData = await getJobDescription(data.job_description_id);
            setJob(jobData);
          } catch {
            setJob(null);
          }
        }
      })
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [analysisId]);

  if (loading) return <LoadingState label="Loading analysis results…" />;
  if (error) return <ErrorState message={error} />;
  if (!analysis) return <ErrorState message="This analysis could not be found." />;

  const matched = analysis.matched_skills ?? [];
  const missing = analysis.missing_skills ?? [];
  const suggestions = analysis.suggestions ?? [];

  return (
    <div>
      <PageHeader
        title="Analysis results"
        subtitle={`${resume?.file_name ?? `Resume #${analysis.resume_id}`} · ${formatDate(analysis.created_at)}`}
        actions={
          <Link to="/analyze">
            <Button variant="secondary">Run another analysis</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center justify-center py-8">
          <AnalysisScore score={analysis.score} />
          <p className="mt-4 text-center text-sm text-muted">
            {job
              ? `Match against ${job.title?.trim() || "saved job description"}`
              : "General resume quality score"}
          </p>
        </Card>

        <div className="grid gap-4">
          <Card>
            <p className="text-sm text-muted">Resume</p>
            <p className="font-semibold text-ink">{resume?.file_name ?? `#${analysis.resume_id}`}</p>
            {job ? (
              <>
                <p className="mt-3 text-sm text-muted">Job description</p>
                <Link to={`/job-descriptions/${job.id}`} className="font-semibold text-brand">
                  {job.title?.trim() || "Untitled role"}
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">No job description was used.</p>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h2 className="text-base font-bold text-ink">Matched skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {matched.length === 0 ? (
                  <p className="text-sm text-muted">No matched skills were returned.</p>
                ) : (
                  matched.map((skill) => <SkillBadge key={skill} label={skill} tone="matched" />)
                )}
              </div>
            </Card>
            <Card>
              <h2 className="text-base font-bold text-ink">Missing skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {missing.length === 0 ? (
                  <p className="text-sm text-muted">No missing skills were returned.</p>
                ) : (
                  missing.map((skill) => <SkillBadge key={skill} label={skill} tone="missing" />)
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <h2 className="text-base font-bold text-ink">Suggestions</h2>
        {suggestions.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No suggestions were returned.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {suggestions.map((item, index) => (
              <li key={`${index}-${item}`} className="flex gap-3 rounded-xl bg-canvas p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-ink">{item}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
