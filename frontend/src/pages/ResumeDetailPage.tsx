import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listAnalysesForResume } from "../api/analyses";
import { getErrorMessage } from "../api/client";
import { getResume } from "../api/resumes";
import { Button } from "../components/Button";
import { Card, PageHeader } from "../components/Card";
import { ErrorState, LoadingState } from "../components/StatusStates";
import { formatDate } from "../lib/format";
import type { Analysis, ResumeDetail } from "../types";

export function ResumeDetailPage() {
  const { id } = useParams();
  const resumeId = Number(id);
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(resumeId)) {
      setError("This resume could not be found.");
      setLoading(false);
      return;
    }

    Promise.all([getResume(resumeId), listAnalysesForResume(resumeId)])
      .then(([resumeData, analysisData]) => {
        setResume(resumeData);
        setAnalyses(analysisData);
      })
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [resumeId]);

  if (loading) return <LoadingState label="Loading resume…" />;
  if (error) return <ErrorState message={error} />;
  if (!resume) return <ErrorState message="This resume could not be found." />;

  const preview = resume.extracted_text?.trim()
    ? resume.extracted_text.slice(0, 1200)
    : null;

  return (
    <div>
      <PageHeader
        title={resume.file_name}
        subtitle={`Uploaded ${formatDate(resume.uploaded_at)}`}
        actions={
          <Link to={`/analyze?resumeId=${resume.id}`}>
            <Button disabled={!resume.has_extracted_text}>Analyze this resume</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="text-base font-bold text-ink">Extracted text</h2>
          <p className="mt-1 text-sm text-muted">
            {resume.has_extracted_text
              ? "Text was extracted from the PDF during upload."
              : "No text was extracted, so this resume cannot be analyzed yet."}
          </p>
          {preview ? (
            <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-canvas p-4 text-sm text-ink">
              {preview}
              {resume.extracted_text && resume.extracted_text.length > 1200 ? "…" : ""}
            </pre>
          ) : (
            <p className="mt-4 text-sm text-muted">No preview available.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-bold text-ink">Analyses for this resume</h2>
          {analyses.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No analyses yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {analyses.map((analysis) => (
                <li key={analysis.id} className="py-3">
                  <Link to={`/analyses/${analysis.id}`} className="font-semibold text-brand">
                    Score {analysis.score == null ? "—" : Math.round(analysis.score)}
                  </Link>
                  <p className="text-xs text-muted">{formatDate(analysis.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
