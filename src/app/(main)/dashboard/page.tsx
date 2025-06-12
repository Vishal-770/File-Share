"use client";

import FilePreview from "@/components/FilePreview";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/database/supabase/supabase";
import React, { useState } from "react";

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errmsg, setErrmsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const UploadFile = (file: File) => {
    if (file && file.size > 2_000_000) {
      setErrmsg(true);
      setFile(null);
    } else {
      setErrmsg(false);
      setFile(file);
    }
  };

  const UploadButtonClicked = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const filePath = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log(data);

    if (error) {
      toast("Upload Failed", {
        description: error.message,
        action: {
          label: "Retry",
          onClick: () => UploadButtonClicked(),
        },
      });
    } else {
      toast("Upload Successful", {
        description: "File uploaded to Supabase.",
      });
      setFile(null);
    }

    setIsUploading(false);
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

      {isUploading && (
        <div className="mx-5 xl:mx-40">
          <Progress value={progress} />
          <p className="text-center mt-2 text-muted-foreground">Uploading...</p>
        </div>
      )}

      <div className="flex items-center justify-center">
        <Button
          onClick={UploadButtonClicked}
          disabled={!file || isUploading}
          className="w-40 h-12"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
