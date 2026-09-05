"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REQUIRED_TYPES = ["O'Level Result / Certificate", "Birth Certificate / Age Declaration", "Passport Photograph", "Local Government Identification"];

export default function DocumentUploadForm() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState(REQUIRED_TYPES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admissions/upload-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentType, fileName: file.name }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setFile(null);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="documentType" className="mb-1 block text-sm font-medium text-ink/70">Document type</label>
        <select id="documentType" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm">
          {REQUIRED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="file" className="mb-1 block text-sm font-medium text-ink/70">File (PDF, JPG, or PNG)</label>
        <input
          id="file" type="file" accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
        <p className="mt-1 text-xs text-ink/40">
          Demo scaffold: only the file name and type are recorded, not the
          file&rsquo;s actual contents — a production deployment needs real
          cloud storage behind this.
        </p>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-6 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
