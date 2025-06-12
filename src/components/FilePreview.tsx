import { File, X } from "lucide-react";
import React from "react";

const formatBytes = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

const FilePreview = ({
  file,
  setfile,
}: {
  file: File;
  setfile: (file: File | null) => void;
}) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted/40 p-4 shadow-sm w-full max-w-xl mx-auto">
      <div className="flex items-center justify-center bg-muted p-3 rounded-md">
        <File className="text-primary" height={32} width={32} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate whitespace-nowrap overflow-hidden">
          {file.name}
        </p>
        <p className="text-sm text-muted-foreground truncate whitespace-nowrap overflow-hidden">
          {file.type}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatBytes(file.size)}
        </p>
      </div>

      <button
        onClick={() => setfile(null)}
        className="text-red-500 hover:text-red-700 transition"
        title="Remove file"
      >
        <X />
      </button>
    </div>
  );
};

export default FilePreview;
