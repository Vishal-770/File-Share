"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export default function PublicUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log("Selected files:", uploadedFiles);
  };

  const handleUploadClick = async () => {
    if (!files.length) return;

    setIsUploading(true);

    try {
      console.log("Uploading files...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Files uploaded!");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="w-full h-screen px-4 py-16 ">
      <div className="max-w-4xl mx-auto flex flex-col justify-between h-full space-y-8 ">
        {/* Top Bar with Back Button and Theme Toggle Placeholder */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          <div>
            <ModeToggle />
          </div>
        </div>

        {/* Header */}
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Public File Upload
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Upload your files to share publicly. Avoid sensitive content—uploads
            may be visible to others.
          </p>
        </section>

        {/* Upload Box */}
        <div className="flex-grow  border border-dashed border-muted rounded-xl p-6 shadow-sm overflow-y-scroll custom-scroll ">
          <FileUpload onChange={handleFileUpload} />
        </div>

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-neutral-400">
          Files are stored in public space. Do not upload anything private or
          confidential.
        </footer>
      </div>
    </main>
  );
}
