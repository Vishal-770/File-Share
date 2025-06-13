"use client";

import FilePreview from "@/components/FilePreview";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/database/supabase/supabase";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UploadFileDetails } from "@/services/service";
import Image from "next/image";

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errmsg, setErrmsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, isLoaded } = useUser();
  const clerkId = user?.id;

  const UploadFile = (file: File) => {
    if (file && file.size > 2_097_152) {
      setErrmsg(true);
      setFile(null);
    } else {
      setErrmsg(false);
      setFile(file);
    }
  };

  const UploadButtonClicked = async () => {
    if (!file || !clerkId) {
      toast.error("User not authenticated or file not selected");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const filePath = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast("Upload Failed", {
        description: error.message,
        action: {
          label: "Retry",
          onClick: () => UploadButtonClicked(),
        },
      });
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    await UploadFileDetails({
      clerkId,
      fileName: file.name ?? data.id,
      fileType: file?.type ?? "unknown",
      fileUrl: urlData?.publicUrl ?? "unknown",
      size: file?.size ?? 0,
      filePath: data.fullPath,
    });

    toast("Upload Successful", {
      description: "File successfully uploaded",
    });

    setFile(null);
    setIsUploading(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }

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
