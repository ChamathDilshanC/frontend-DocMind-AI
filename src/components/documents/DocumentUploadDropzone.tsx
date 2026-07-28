"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadDocument } from "@/hooks/useDocuments";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

export function DocumentUploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const upload = useUploadDocument();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => upload.mutate(file));
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">Drag and drop a PDF or DOCX file here</p>
      <p className="text-xs text-muted-foreground">or</p>
      <button
        type="button"
        className="mt-2 text-sm font-medium text-primary underline underline-offset-4 disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
      >
        {upload.isPending ? "Uploading..." : "Browse files"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
