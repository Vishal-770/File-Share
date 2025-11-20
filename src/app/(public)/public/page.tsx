"use client";

import React, { ReactNode, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { supabase } from "@/database/supabase/supabase";
import { SendEmail, UploadPublicFiles } from "@/services/service";
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
import {
  X,
  UploadCloud,
  QrCode,
  ArrowLeft,
  File,
  Loader2,
  Send,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { MultiEmailInput } from "@/components/MultiEmailInput";

export default function PublicUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [resetKey, setResetKey] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [showQrDialog, setShowQrDialog] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [senderName, setSenderName] = useState<string>("");
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const router = useRouter();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const urls: string[] = [];
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        const filePath = `publicuploads/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file, { upsert: true });

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        const { data } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        urls.push(data.publicUrl);
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      }

      const res = await UploadPublicFiles(urls);

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
      setUploadProgress(0);
      toast.success("Files uploaded successfully!");
    },
    onError: (err) => {
      setUploadProgress(0);
      toast.error(err.message || "Upload failed");
    },
  });

  const handleUploadClick = () => {
    if (!files.length) {
      toast.warning("Please select files first");
      return;
    }
    uploadMutation.mutate();
  };

  const canSendEmail =
    !!publicUrl && recipientEmails.length > 0 && !isSendingEmail;

  const handleSendEmail = async () => {
    if (!publicUrl) {
      toast.error("Upload files to generate a share link first");
      return;
    }
    if (!recipientEmails.length) {
      toast.warning("Add at least one recipient email");
      return;
    }

    setIsSendingEmail(true);
    try {
      await SendEmail({
        recipientEmails,
        senderName: senderName.trim() || "Public uploader",
        shareUrls: [publicUrl],
      });
      toast.success(
        `Email sent to ${recipientEmails.length} recipient${
          recipientEmails.length === 1 ? "" : "s"
        }`
      );
      setRecipientEmails([]);
      setSenderName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <main className="w-full min-h-screen px-4 py-8 sm:py-16 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <ModeToggle />
        </div>

        {/* Header */}
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Public File Upload
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Upload your files to share publicly. Avoid sensitive content.
          </p>
        </section>

        {/* Main content */}
        <div className="flex flex-col flex-grow gap-6">
          {/* Upload area (fixed height) */}
          <div className="h-64 border-2 border-dashed border-foreground/50 rounded-xl p-4 flex flex-col items-center justify-center">
            <FileUpload
              onChange={handleFileUpload}
              resetKey={resetKey}
            ></FileUpload>
          </div>

          {/* Files list (scrollable) */}
          {files.length > 0 && (
            <div className="flex-1 overflow-hidden">
              <div className="h-full max-h-[300px] overflow-y-auto custom-scroll border rounded-lg divide-y">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileIcon extension={getFileExtension(file.name)} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-evenly">
            {files.length > 0 && (
              <Button
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
                className=" gap-2"
                size="lg"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Upload {files.length} file{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}

            {qrCodeUrl && !uploadMutation.isPending && (
              <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2" size="lg">
                    <QrCode className="w-4 h-4" />
                    View QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Files</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-4 gap-4">
                    <div className="relative w-48 h-48">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="w-full text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Scan to access or share this link:
                      </p>
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {publicUrl}
                      </a>
                    </div>
                    <Button
                      onClick={() => navigator.clipboard.writeText(publicUrl)}
                      size="sm"
                      variant="outline"
                      className="mt-2"
                    >
                      Copy Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {publicUrl && (
            <div className="border rounded-2xl p-4 sm:p-6 space-y-4 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Share via Email
                  </p>
                  <h3 className="text-lg font-bold">
                    Send this public link directly to someone&#39;s inbox
                  </h3>
                </div>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {publicUrl}
                </a>
              </div>
              <MultiEmailInput
                value={recipientEmails}
                onChange={setRecipientEmails}
                label="Recipient emails"
                description="Press Enter, comma, or paste a list to add multiple people."
                disabled={isSendingEmail}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Your name (optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  disabled={isSendingEmail}
                />
                <div className="rounded-lg border border-dashed border-border/70 bg-background/60 p-3 text-sm text-muted-foreground">
                  {recipientEmails.length ? (
                    <p>
                      Sending to {recipientEmails.length} recipient
                      {recipientEmails.length !== 1 ? "s" : ""}
                    </p>
                  ) : (
                    <p>Add recipients to enable email delivery.</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Button
                  onClick={handleSendEmail}
                  disabled={!canSendEmail}
                  className="gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Email Share Link
                    </>
                  )}
                </Button>
                {recipientEmails.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setRecipientEmails([])}
                    disabled={isSendingEmail}
                  >
                    Clear Recipients
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          Files are stored in public space. Do not upload private or
          confidential information.
        </footer>
      </div>
    </main>
  );
}

// Helper components and functions
function FileIcon({ extension }: { extension: string }) {
  const iconClass = "w-5 h-5 text-muted-foreground";
  const commonExtensions: Record<string, ReactNode> = {
    pdf: <File className={iconClass} />,
    doc: <File className={iconClass} />,
    docx: <File className={iconClass} />,
    xls: <File className={iconClass} />,
    xlsx: <File className={iconClass} />,
    ppt: <File className={iconClass} />,
    pptx: <File className={iconClass} />,
    jpg: <File className={iconClass} />,
    jpeg: <File className={iconClass} />,
    png: <File className={iconClass} />,
    gif: <File className={iconClass} />,
    mp4: <File className={iconClass} />,
    mp3: <File className={iconClass} />,
    zip: <File className={iconClass} />,
    txt: <File className={iconClass} />,
  };

  return (
    commonExtensions[extension.toLowerCase()] || <File className={iconClass} />
  );
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop() || "";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
