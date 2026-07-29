"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUploadDocument } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAccepted(file: File) {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function DocumentUploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const upload = useUploadDocument();

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!isAccepted(file)) return;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    upload.mutate(selectedFile, { onSuccess: () => setSelectedFile(null) });
  };

  return (
    <div className="w-full">
      <h3 className="text-balance font-semibold text-foreground">Upload a document</h3>

      <div
        className={cn(
          "mt-4 flex justify-center space-x-4 rounded-md border border-dashed px-6 py-10 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-input",
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
        <div className="sm:flex sm:items-center sm:gap-x-3">
          <Upload aria-hidden className="mx-auto h-8 w-8 text-muted-foreground sm:mx-0 sm:h-6 sm:w-6" />
          <div className="mt-4 flex text-foreground text-sm leading-6 sm:mt-0">
            <p>Drag and drop or</p>
            <Label
              className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
              htmlFor="document-upload-input"
            >
              <span>choose file</span>
              <input
                ref={inputRef}
                id="document-upload-input"
                name="document-upload-input"
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </Label>
            <p className="text-pretty pl-1">to upload</p>
          </div>
        </div>
      </div>

      <p className="mt-2 text-pretty text-muted-foreground text-xs leading-5">
        Accepted file types: PDF, DOCX.
      </p>

      {selectedFile && (
        <>
          <div className="relative mt-4 rounded-lg bg-muted p-3">
            <div className="absolute top-1 right-1">
              <Button
                aria-label="Remove"
                className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
                size="sm"
                type="button"
                variant="ghost"
                disabled={upload.isPending}
                onClick={() => {
                  setSelectedFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                <X aria-hidden className="size-4 shrink-0" />
              </Button>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-input ring-inset">
                <FileText aria-hidden className="size-5 text-foreground" />
              </span>
              <div className="w-full min-w-0">
                <p className="truncate text-pretty font-medium text-foreground text-xs">{selectedFile.name}</p>
                <p className="mt-0.5 flex justify-between text-pretty text-muted-foreground text-xs">
                  <span>{formatBytes(selectedFile.size)}</span>
                  <span>{upload.isPending ? "Uploading..." : "Ready"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              disabled={upload.isPending}
              onClick={() => {
                setSelectedFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Cancel
            </Button>
            <Button type="button" disabled={upload.isPending} onClick={handleUpload}>
              {upload.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
