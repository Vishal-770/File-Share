"use client";
import FilePreview from "@/components/FilePreview";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errmsg, setErrmsg] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const UploadFile = (file: File) => {
    if (file && file.size > 2_000_000) {
      setErrmsg(true);
      setFile(null);
    } else {
      setErrmsg(false);
      setFile(file);
    }
    console.log(file);
  };

  const UploadButtonClicked = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setUploadedUrl(data.url);
      setFile(null); // clear after upload
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-bold text-center text-3xl mt-10">
        Start <strong>Uploading File and Share It</strong>
      </h2>

      <div className="mx-5 xl:mx-40">
        <FileUpload setFile={UploadFile} />
      </div>

      {errmsg && (
        <p className="text-center text-red-500 font-medium">
          File too large! Max size is 2MB.
        </p>
      )}

      {file && <FilePreview file={file} setfile={setFile} />}

      <div className="flex items-center justify-center">
        <Button
          onClick={UploadButtonClicked}
          disabled={!file || isUploading}
          className="w-70 h-12"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {uploadedUrl && (
        <p className="text-center text-green-600 mt-4">
          File uploaded:{" "}
          <a
            href={uploadedUrl}
            target="_blank"
            className="text-blue-600 underline"
          >
            {uploadedUrl}
          </a>
        </p>
      )}
      {uploadedUrl && (
        <p className="text-center text-green-600 mt-4">
          File uploaded:&nbsp;
          <a
            href={uploadedUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download File
          </a>
        </p>
      )}
    </div>
  );
};

export default Dashboard;
