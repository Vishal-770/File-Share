import { File, X } from "lucide-react";
import React from "react";

const formatBytes = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

// Single file preview component
const SingleFilePreview = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted/40 p-4 shadow-sm">
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
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 transition cursor-pointer"
        title="Remove file"
      >
        <X />
      </button>
    </div>
  );
};

// Multiple files preview component
const FilePreview = ({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">
          Selected Files ({files.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          Total: {formatBytes(totalSize)}
        </p>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <SingleFilePreview
            key={`${file.name}-${file.size}-${index}`}
            file={file}
            onRemove={() => removeFile(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilePreview;
