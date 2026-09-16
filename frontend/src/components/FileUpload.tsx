import { useRef, useState } from "react";

type FileUploadProps = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  accept?: string;
};

export function FileUpload({
  onFileSelected,
  disabled = false,
  accept = "application/pdf",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function takeFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    onFileSelected(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => takeFile(event.target.files?.[0])}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          takeFile(event.dataTransfer.files?.[0]);
        }}
        className={`w-full rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragOver ? "border-brand bg-brand-soft" : "border-line bg-white"
        } disabled:opacity-60`}
      >
        <p className="text-sm font-semibold text-ink">
          {fileName ? fileName : "Drop a PDF resume here, or click to browse"}
        </p>
        <p className="mt-1 text-sm text-muted">Only PDF files are supported.</p>
      </button>
    </div>
  );
}
