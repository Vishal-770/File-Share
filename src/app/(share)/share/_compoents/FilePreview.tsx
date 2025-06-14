"use client";

import { Button } from "@/components/ui/button";
import FileDetails from "@/types/FileType";
import { handleDownload } from "@/utils/functions";
import Image from "next/image";
import { FileText, ImageIcon, Download, UploadCloud } from "lucide-react";

const FilePreview = ({ file }: { file: FileDetails }) => {
  const isImage = file?.fileType?.startsWith("image/");

  return (
    <div className="max-w-2xl w-full mx-auto rounded-2xl border bg-background p-6 md:p-8 shadow-xl space-y-6 transition-all duration-300 ease-in-out">
      {/* Heading */}
      <div className="flex items-center justify-center gap-3 pb-4 border-b border-border">
        <UploadCloud className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">File Drop</h2>
      </div>

      {/* No File */}
      {!file ? (
        <div className="text-center text-muted-foreground text-sm p-8">
          No file selected. Please upload a file to preview and download.
        </div>
      ) : (
        <>
          {/* File Header */}
          <div className="flex items-center gap-3">
            {isImage ? (
              <ImageIcon className="w-6 h-6 text-blue-500" />
            ) : (
              <FileText className="w-6 h-6 text-muted-foreground" />
            )}
            <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
              {file.fileName}
            </h1>
          </div>

          {/* Preview Section */}
          {isImage ? (
            <div className="relative w-full aspect-video bg-muted border border-border rounded-xl overflow-hidden">
              <Image
                src={file.fileUrl}
                alt={file.fileName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="bg-muted text-muted-foreground text-center p-6 rounded-xl text-sm font-medium border border-border">
              <p>{file.fileType?.toUpperCase()} File</p>
            </div>
          )}

          {/* File Info */}
          <div className="text-sm text-muted-foreground">
            Size:{" "}
            <span className="font-medium text-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>

          {/* Download Button */}
          <Button
            onClick={() => handleDownload(file.fileUrl, file.fileName)}
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            Download File
          </Button>
        </>
      )}
    </div>
  );
};

export default FilePreview;
