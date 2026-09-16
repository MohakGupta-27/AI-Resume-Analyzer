import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { uploadResume } from "../api/resumes";
import { Button } from "../components/Button";
import { FileUpload } from "../components/FileUpload";
import { PageHeader } from "../components/Card";
import { ErrorState, SuccessState } from "../components/StatusStates";

export function ResumeUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onUpload() {
    if (!file) {
      setError("Choose a PDF before uploading.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const resume = await uploadResume(file);
      setSuccess(`${resume.file_name} uploaded and processed.`);
      navigate(`/resumes/${resume.id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Upload resume"
        subtitle="Select a PDF. The backend extracts text immediately, then the resume is ready to analyze."
      />
      <div className="mx-auto max-w-2xl space-y-4">
        {error ? <ErrorState message={error} /> : null}
        {success ? <SuccessState message={success} /> : null}
        <FileUpload onFileSelected={setFile} disabled={uploading} />
        <ol className="grid gap-3 text-sm text-muted sm:grid-cols-4">
          <li className="rounded-xl bg-white p-3 ring-1 ring-line">1. Select PDF</li>
          <li className="rounded-xl bg-white p-3 ring-1 ring-line">2. Upload</li>
          <li className="rounded-xl bg-white p-3 ring-1 ring-line">3. Extract text</li>
          <li className="rounded-xl bg-white p-3 ring-1 ring-line">4. Analyze</li>
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onUpload} disabled={uploading || !file}>
            {uploading ? "Uploading and processing…" : "Upload PDF"}
          </Button>
          <Link to="/resumes">
            <Button variant="secondary">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
