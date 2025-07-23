"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { supabase } from "@/database/supabase/supabase";
import { UploadPublicFiles } from "@/services/service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function PublicUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [resetKey, setResetKey] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [showQrDialog, setShowQrDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const urls: string[] = [];

      for (const file of files) {
        const filePath = `publicuploads/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file, { upsert: true });

        if (error)
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);

        const { data } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        urls.push(data.publicUrl);
      }

      const res = await UploadPublicFiles(urls);

      // Convert Blob QR code to base64 if needed
      const qrCodeData = res?.data?.qrCode;
      if (qrCodeData instanceof Blob) {
        const base64 = await blobToBase64(qrCodeData);
        setQrCodeUrl(base64);
      } else {
        setQrCodeUrl(qrCodeData || "");
      }

      setPublicUrl(res?.data?.url || "");
      return urls;
    },
    onSuccess: () => {
      setFiles([]);
      setResetKey(Date.now().toString());
      setShowQrDialog(true);
      toast.success("Files uploaded and QR code generated!");
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed.");
    },
  });

  const handleUploadClick = () => {
    if (!files.length) {
      toast.warning("Please select files first.");
      return;
    }
    uploadMutation.mutate();
  };

  return (
    <main className="w-full h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto flex flex-col justify-between h-full space-y-8">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          <ModeToggle />
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

        {/* Upload area */}
        <div className="flex-grow border border-dashed border-muted rounded-xl p-6 shadow-sm overflow-y-auto custom-scroll">
          <FileUpload onChange={handleFileUpload} resetKey={resetKey} />
        </div>

        {/* Upload button */}
        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className="w-full sm:w-auto"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        )}

        {/* QR Code Dialog */}
        {qrCodeUrl && !uploadMutation.isPending && (
          <div className="flex justify-center">
            <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">View QR Code</Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-md text-center">
                <DialogHeader>
                  <DialogTitle>Shareable QR Code</DialogTitle>
                </DialogHeader>
                <div className="my-4 space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      fill
                      className="object-contain rounded-md shadow-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">
                      Or open directly:
                    </p>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline break-all"
                    >
                      {publicUrl}
                    </a>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-neutral-400 mt-6">
          Files are stored in public space. Do not upload anything private or
          confidential.
        </footer>
      </div>
    </main>
  );
}

// Helper: convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
