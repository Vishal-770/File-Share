"use client";

import { Button } from "@/components/ui/button";
import FileDetails from "@/types/FileType";
import { handleDownload } from "@/utils/functions";
import Image from "next/image";
import { FileText, ImageIcon, Download, UploadCloud } from "lucide-react";

const FilePreview = ({ file }: { file: FileDetails }) => {
  const isImage = file?.fileType?.startsWith("image/");

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6 transition-all duration-300 ease-in-out border border-gray-100">
      {/* Main Heading */}
      <div className="flex items-center justify-center gap-3 pb-4 border-b">
        <UploadCloud className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">File Drop</h2>
      </div>

      {/* No File Case */}
      {!file ? (
        <div className="text-center text-gray-500 text-sm p-8">
          No file selected. Please upload a file to preview and download.
        </div>
      ) : (
        <>
          {/* File Header */}
          <div className="flex items-center gap-3">
            {isImage ? (
              <ImageIcon className="w-6 h-6 text-blue-600" />
            ) : (
              <FileText className="w-6 h-6 text-gray-500" />
            )}
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              {file.fileName}
            </h1>
          </div>

          {/* File Preview */}
          {isImage ? (
            <div className="relative w-full aspect-video bg-gray-100 border rounded-xl overflow-hidden">
              <Image
                src={file.fileUrl}
                alt={file.fileName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-700 text-center p-6 rounded-xl text-sm font-medium border">
              <p>{file.fileType.toUpperCase()} File</p>
            </div>
          )}

          {/* File Info */}
          <div className="text-sm text-gray-600">
            Size:{" "}
            <span className="font-medium">
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
