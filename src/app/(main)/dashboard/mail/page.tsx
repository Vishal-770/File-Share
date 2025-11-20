"use client";

import JSZip from "jszip";
import { getFileDetails } from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { SendEmail } from "@/services/service";
import { toast } from "sonner";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import FileTable from "./_components/FileTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiEmailInput } from "@/components/MultiEmailInput";
import { FileText, Loader2, Mail, Send } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { supabase } from "@/database/supabase/supabase";
import type { FileDetails } from "@/types/FileType";

const Page = () => {
  const { isLoaded, user } = useUser();
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [bundleAsZip, setBundleAsZip] = useState(false);
  const [isBundling, setIsBundling] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["files", user?.id],
    queryFn: () => getFileDetails(user!.id),
    enabled: isLoaded && !!user?.id,
  });

  const files = useMemo(() => {
    return (data?.files ?? []) as FileDetails[];
  }, [data?.files]);

  useEffect(() => {
    if (!files.length) return;
    const validUrls = new Set(files.map((file) => file.fileUrl));
    setSelectedUrls((prev) => prev.filter((url) => validUrls.has(url)));
  }, [files]);

  const selectedFiles = useMemo<FileDetails[]>(() => {
    if (!files.length || !selectedUrls.length) return [];
    const lookup = new Set(selectedUrls);
    return files.filter((file) => lookup.has(file.fileUrl));
  }, [files, selectedUrls]);

  const totalSelectedSize = useMemo(() => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  }, [selectedFiles]);

  const canBundleSelection = selectedFiles.length >= 2;
  const isProcessing = isSending || isBundling;
  const canSend =
    selectedFiles.length > 0 && recipients.length > 0 && !isProcessing;

  const bundleSelectionToZip = useCallback(async () => {
    if (!selectedFiles.length) {
      throw new Error("No files selected to bundle");
    }

    const archive = new JSZip();

    await Promise.all(
      selectedFiles.map(async (file) => {
        const response = await fetch(file.fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to download ${file.fileName}`);
        }
        const blob = await response.blob();
        const safeName = file.fileName || `file-${Date.now()}`;
        archive.file(safeName, blob);
      })
    );

    const zipBlob = await archive.generateAsync({ type: "blob" });
    const objectPath = `mail-archives/${
      user?.id ?? "anonymous"
    }/${Date.now()}.zip`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(objectPath, zipBlob, {
        contentType: "application/zip",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(objectPath);

    if (!publicData?.publicUrl) {
      throw new Error("Unable to generate public URL for zip archive");
    }

    return publicData.publicUrl;
  }, [selectedFiles, user?.id]);

  const handleSendEmails = async () => {
    if (!recipients.length) {
      toast.error("Add at least one recipient email");
      return;
    }
    if (!selectedFiles.length) {
      toast.error("Select at least one file");
      return;
    }
    setIsSending(true);
    try {
      let urlsToSend = selectedUrls;

      if (bundleAsZip && canBundleSelection) {
        setIsBundling(true);
        const bundlingToastId = toast.loading(
          "Packaging files into a ZIP archive..."
        );
        try {
          const zipUrl = await bundleSelectionToZip();
          urlsToSend = Array.from(new Set([zipUrl, ...selectedUrls]));
          toast.success("ZIP archive ready", { id: bundlingToastId });
        } catch (zipError) {
          toast.error("Failed to create ZIP archive", { id: bundlingToastId });
          throw zipError;
        } finally {
          setIsBundling(false);
        }
      }

      await SendEmail({
        recipientEmails: recipients,
        senderName:
          user?.firstName ||
          user?.emailAddresses[0]?.emailAddress ||
          "Anonymous",
        shareUrls: urlsToSend,
      });

      toast.success(
        `Email sent to ${recipients.length} recipient${
          recipients.length === 1 ? "" : "s"
        }`
      );
      setRecipients([]);
      setSelectedUrls([]);
      setBundleAsZip(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send your files. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                File Sharing Dashboard
              </h1>
              <p className="text-muted-foreground">
                Search your files, curate a selection, and share from anywhere
                in the app.
              </p>
            </div>

            <Card className="border shadow-sm">
              <CardHeader className="gap-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Uploaded Files
                </CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Fetching your latest uploads..."
                    : `${files.length} file${
                        files.length === 1 ? "" : "s"
                      } available`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FileTable
                  files={files}
                  selectedUrls={selectedUrls}
                  setSelectedUrls={setSelectedUrls}
                />
              </CardContent>
            </Card>
          </div>
          <section className="mt-6 rounded-3xl border bg-background/95 px-4 py-6 shadow-xl lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Share Queue
                    </p>
                    <h2 className="text-xl font-semibold">
                      {selectedFiles.length} file
                      {selectedFiles.length === 1 ? "" : "s"} selected ·{" "}
                      {formatFileSize(totalSelectedSize)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUrls([])}
                      >
                        Clear files
                      </Button>
                    )}
                    {recipients.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setRecipients([])}
                      >
                        Clear recipients
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <MultiEmailInput
                    value={recipients}
                    onChange={setRecipients}
                    label="Recipient emails"
                    description="Add addresses, press Enter or paste a comma separated list."
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="w-full rounded-2xl border bg-card/80 p-4 shadow-lg backdrop-blur md:w-[360px]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="bundle-zip"
                        checked={bundleAsZip && canBundleSelection}
                        onCheckedChange={(checked) =>
                          setBundleAsZip(Boolean(checked))
                        }
                        disabled={!canBundleSelection || isProcessing}
                      />
                      <label
                        htmlFor="bundle-zip"
                        className="flex flex-1 flex-col gap-0.5"
                      >
                        <span className="text-sm font-medium">
                          Bundle selection into a ZIP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {canBundleSelection
                            ? "We will upload a zipped archive and include it in the email."
                            : "Select at least two files to enable bundling."}
                        </span>
                      </label>
                    </div>

                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      {selectedFiles.length === 0 ? (
                        <p>No files selected yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFiles.slice(0, 3).map((file) => (
                            <p key={file.fileUrl} className="truncate">
                              {file.fileName}
                            </p>
                          ))}
                          {selectedFiles.length > 3 && (
                            <p className="text-xs">
                              + {selectedFiles.length - 3} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        disabled={!canSend}
                        className="w-full gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Review & Send
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Confirm File Sharing
                    </DialogTitle>
                    <DialogDescription>
                      Sending {selectedFiles.length} file
                      {selectedFiles.length === 1 ? "" : "s"} to{" "}
                      {recipients.length} recipient
                      {recipients.length === 1 ? "" : "s"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Recipients
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipients.map((recipient) => (
                          <Badge
                            key={recipient}
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                          >
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Files
                      </p>
                      <div className="mt-2 rounded-lg border border-dashed border-border/70 bg-muted/40 p-3 text-sm">
                        {selectedFiles.slice(0, 4).map((file) => (
                          <p
                            key={file.fileUrl}
                            className="truncate text-foreground/90"
                          >
                            {file.fileName}
                          </p>
                        ))}
                        {selectedFiles.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            + {selectedFiles.length - 4} more
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-xs text-muted-foreground">
                      {bundleAsZip && canBundleSelection
                        ? "ZIP bundling enabled: we will upload your selection as a single archive and include the link alongside the original files."
                        : "We will send individual links for each selected file."}
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSendEmails}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isBundling ? "Bundling..." : "Sending..."}
                        </>
                      ) : (
                        `Send ${selectedFiles.length} file${
                          selectedFiles.length === 1 ? "" : "s"
                        }`
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Page;
