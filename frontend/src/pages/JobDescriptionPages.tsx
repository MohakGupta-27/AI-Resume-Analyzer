import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import {
  createJobDescription,
  deleteJobDescription,
  getJobDescription,
  listJobDescriptions,
} from "../api/jobDescriptions";
import { Button } from "../components/Button";
import { Card, PageHeader } from "../components/Card";
import { Input, TextArea } from "../components/Input";
import { EmptyState, ErrorState, LoadingState, SuccessState } from "../components/StatusStates";
import { formatDate } from "../lib/format";
import type { JobDescription } from "../types";

export function JobDescriptionListPage() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadJobs() {
    return listJobDescriptions().then(setJobs);
  }

  useEffect(() => {
    loadJobs()
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!description.trim()) {
      setFormError("Job description text is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    setSuccess(null);
    try {
      await createJobDescription({
        title: title.trim() || undefined,
        description_text: description.trim(),
      });
      setTitle("");
      setDescription("");
      setSuccess("Job description saved.");
      await loadJobs();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    setError(null);
    try {
      await deleteJobDescription(id);
      setJobs((current) => current.filter((job) => job.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading job descriptions…" />;

  return (
    <div>
      <PageHeader
        title="Job descriptions"
        subtitle="Save a role once, then optionally attach it when you analyze a resume."
      />
      {error ? <div className="mb-4"><ErrorState message={error} /></div> : null}
      {success ? <div className="mb-4"><SuccessState message={success} /></div> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <h2 className="text-base font-bold text-ink">Create job description</h2>
          <form className="mt-4 space-y-4" onSubmit={onCreate}>
            {formError ? <ErrorState message={formError} /> : null}
            <Input
              label="Title (optional)"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <TextArea
              label="Description"
              name="description_text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save job description"}
            </Button>
          </form>
        </Card>

        <div>
          {jobs.length === 0 ? (
            <EmptyState
              title="No job descriptions yet"
              description="Paste a posting on the left. You can still analyze a resume without one."
            />
          ) : (
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Card>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link to={`/job-descriptions/${job.id}`} className="font-bold text-ink">
                          {job.title?.trim() || "Untitled role"}
                        </Link>
                        <p className="mt-1 text-xs text-muted">{formatDate(job.created_at)}</p>
                        <p className="mt-2 line-clamp-3 text-sm text-muted">{job.description_text}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link to={`/analyze?jobId=${job.id}`}>
                          <Button>Use in analysis</Button>
                        </Link>
                        <Button variant="secondary" onClick={() => onDelete(job.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function JobDescriptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jobId = Number(id);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(jobId)) {
      setError("This job description could not be found.");
      setLoading(false);
      return;
    }
    getJobDescription(jobId)
      .then(setJob)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function onDelete() {
    if (!job) return;
    try {
      await deleteJobDescription(job.id);
      navigate("/job-descriptions", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading job description…" />;
  if (error) return <ErrorState message={error} />;
  if (!job) return <ErrorState message="This job description could not be found." />;

  return (
    <div>
      <PageHeader
        title={job.title?.trim() || "Untitled role"}
        subtitle={`Saved ${formatDate(job.created_at)}`}
        actions={
          <div className="flex gap-2">
            <Link to={`/analyze?jobId=${job.id}`}>
              <Button>Analyze with this job</Button>
            </Link>
            <Button variant="secondary" onClick={onDelete}>
              Delete
            </Button>
          </div>
        }
      />
      <Card>
        <p className="whitespace-pre-wrap text-sm leading-6 text-ink">{job.description_text}</p>
      </Card>
    </div>
  );
}
