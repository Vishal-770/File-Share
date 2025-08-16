"use client";

import FilePreview from "@/components/FilePreview";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/database/supabase/supabase";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FetchUser, UploadFileDetails } from "@/services/service";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StorageBar from "./_components/StorageBar";

const Dashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
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

  const ValidateFiles = (incomingFiles: File[]) => {
    if (!userData?.user?.max_file_upload_size) return;

    const maxSize = userData.user.max_file_upload_size;
    const validFiles: File[] = [];
    const errors: string[] = [];

    incomingFiles.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(
          `${file.name} is too large! Max allowed size is ${(maxSize / 1024 / 1024).toFixed(
            2
          )} MB. File size is ${(file.size / 1024 / 1024).toFixed(2)} MB.`
        );
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setErrmsg(errors.join("\n"));
    } else {
      setErrmsg("");
    }

    setFiles(validFiles);
  };

  const UploadAllFiles = async () => {
    if (!files.length || !clerkId) {
      toast.error("User not authenticated or no files selected");
      return;
    }

    // Check storage space
    if (userData?.user?.current_storage_size > userData?.user.max_storage_size) {
      toast.error("Storage Full");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const totalFiles = files.length;
    let completedFiles = 0;
    let successfulUploads = 0;
    
    for (const file of files) {
      try {
        const filePath = `fileuploads/${Date.now()}-${file.name}`;
        
        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error(`Upload failed for ${file.name}`, {
            description: error.message,
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        // Save file details to database
        await UploadFileDetails({
          clerkId,
          fileName: file.name ?? data.id,
          fileType: file?.type ?? "unknown",
          fileUrl: urlData?.publicUrl ?? "unknown",
          size: file?.size ?? 0,
          filePath,
        });

        successfulUploads++;
        
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        toast.error(`Failed to upload ${file.name}`);
      }
      
      completedFiles++;
      setProgress((completedFiles / totalFiles) * 100);
    }

    // Show results
    if (successfulUploads === totalFiles) {
      toast.success(`Successfully uploaded ${successfulUploads} file${successfulUploads > 1 ? 's' : ''}`);
    } else if (successfulUploads > 0) {
      toast.warning(`Uploaded ${successfulUploads} of ${totalFiles} files`);
    } else {
      toast.error("Failed to upload any files");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
    setFiles([]);
    setIsUploading(false);
    setProgress(0);
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
        <StorageBar
          current_storage_size={current_storage_size}
          usagePercent={usagePercent}
          max_storage_size={max_storage_size}
        />
      </div>

      {/* Upload section */}
      <div className="w-full">
        <FileUpload 
          onChange={ValidateFiles}
          resetKey={files.length === 0 ? "reset" : ""}
        />
      </div>

      {errmsg && (
        <div className="w-full flex justify-center">
          <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-md max-w-md text-center whitespace-pre-line">
            {errmsg}
          </p>
        </div>
      )}

      {files.length > 0 && <FilePreview files={files} setFiles={setFiles} />}

      {isUploading && (
        <div className="w-full max-w-md mx-auto space-y-2">
          <Progress value={progress} />
          <p className="text-center text-sm text-muted-foreground">
            Uploading {files.length} file{files.length > 1 ? 's' : ''}...
          </p>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          onClick={UploadAllFiles}
          disabled={!files.length || isUploading}
          size="lg"
          className="w-full max-w-xs"
        >
          {isUploading 
            ? "Uploading..." 
            : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
          }
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
