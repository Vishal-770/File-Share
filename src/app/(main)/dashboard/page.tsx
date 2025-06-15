"use client";

import FilePreview from "@/components/FilePreview";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/database/supabase/supabase";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FetchUser, UploadFileDetails } from "@/services/service";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errmsg, setErrmsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id;

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => FetchUser(user!.id),
    enabled: isLoaded && isSignedIn,
  });

  const UploadFile = (file: File) => {
    if (!userData?.user?.max_file_upload_size) return;

    const maxSize = userData.user.max_file_upload_size;
    if (file && file.size > maxSize) {
      setErrmsg(
        `File too large! Max allowed size is ${(maxSize / 1024 / 1024).toFixed(
          2
        )} MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB.`
      );
      setFile(null);
    } else {
      setErrmsg("");
      setFile(file);
    }
  };

  const UploadButtonClicked = async () => {
    if (!file || !clerkId) {
      toast.error("User not authenticated or file not selected");
      return;
    }
    if (
      userData?.user?.current_storage_size > userData?.user.max_storage_size
    ) {
      toast.error("Storage Full");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const filePath = `fileuploads/${Date.now()}-${file.name}`;
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
      filePath,
    });

    toast("Upload Successful", {
      description: "File successfully uploaded",
    });
    queryClient.invalidateQueries({ queryKey: ["user"] });

    setFile(null);
    setIsUploading(false);
  };

  if (error) {
    return (
      <div>
        <h1>Some Error Occurred. Please try again later.</h1>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }

  const { current_storage_size, max_storage_size } = userData.user;
  const usagePercent = Math.min(
    (current_storage_size / max_storage_size) * 100,
    100
  );

  return (
    <div className="relative flex flex-col gap-6 px-4 py-6 max-w-4xl mx-auto">
      {/* Header and Storage in responsive layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h2 className="font-semibold text-2xl text-center lg:text-left">
          Start <strong className="text-primary">Uploading</strong> and Sharing
          Files
        </h2>

        {/* Storage Indicator */}
        <div className="w-full lg:w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {(current_storage_size / 1024 / 1024).toFixed(3)} MB used
              </span>
              <span className="font-medium">{usagePercent.toFixed(2)}%</span>
            </div>
            <Progress value={usagePercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center lg:text-right">
              {(max_storage_size / 1024 / 1024).toFixed(3)} MB total available
            </p>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="w-full">
        <FileUpload setFile={UploadFile} />
      </div>

      {errmsg && (
        <div className="w-full flex justify-center">
          <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-md max-w-md text-center">
            {errmsg}
          </p>
        </div>
      )}

      {file && <FilePreview file={file} setfile={setFile} />}

      {isUploading && (
        <div className="w-full max-w-md mx-auto space-y-2">
          <Progress value={progress} />
          <p className="text-center text-sm text-muted-foreground">
            Uploading your file...
          </p>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          onClick={UploadButtonClicked}
          disabled={!file || isUploading}
          size="lg"
          className="w-full max-w-xs"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
