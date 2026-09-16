import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { listResumes } from "../api/resumes";
import { Button } from "../components/Button";
import { PageHeader } from "../components/Card";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusStates";
import { formatDate } from "../lib/format";
import type { Resume } from "../types";

export function ResumeListPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listResumes()
      .then(setResumes)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading resumes…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader
        title="Resumes"
        subtitle="Every PDF you upload is stored here and can be analyzed."
        actions={
          <Link to="/resumes/upload">
            <Button>Upload resume</Button>
          </Link>
        }
      />
      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes uploaded"
          description="Select a PDF to extract text and make it available for analysis."
          action={
            <Link to="/resumes/upload">
              <Button>Upload a PDF</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {resumes.map((resume) => (
              <li key={resume.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{resume.file_name}</p>
                  <p className="text-sm text-muted">Uploaded {formatDate(resume.uploaded_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">
                    {resume.has_extracted_text ? "Text extracted" : "No extracted text"}
                  </span>
                  <Link to={`/resumes/${resume.id}`} className="text-sm font-semibold text-brand">
                    Details
                  </Link>
                  <Link to={`/analyze?resumeId=${resume.id}`}>
                    <Button>Analyze</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
