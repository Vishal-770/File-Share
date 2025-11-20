"use client";

import { getFileDetails } from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { SendEmail } from "@/services/service"; // Adjust path as per your project
import { toast } from "sonner";
import React, { useState } from "react";
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
import { FileText, Loader2, Mail, Send } from "lucide-react";
import { MultiEmailInput } from "@/components/MultiEmailInput";

const Page = () => {
  const { isLoaded, user } = useUser();
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["files", user?.id],
    queryFn: () => getFileDetails(user!.id),
    enabled: isLoaded && !!user?.id,
  });

  const canSend = recipients.length > 0 && selectedUrls.length > 0;

  const handleSendEmails = async () => {
    if (!recipients.length) {
      toast.error("Add at least one recipient email");
      return;
    }
    setIsSending(true);
    try {
      await SendEmail({
        recipientEmails: recipients,
        senderName:
          user?.firstName ||
          user?.emailAddresses[0]?.emailAddress ||
          "Anonymous",
        shareUrls: selectedUrls,
      });

      toast.success(
        `Email sent to ${recipients.length} recipient${
          recipients.length === 1 ? "" : "s"
        }`
      );
      setRecipients([]);
      setSelectedUrls([]);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your files...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              File Sharing Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and share your uploaded files with others
            </p>
          </div>

          {/* Files Card */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Uploaded Files
              </CardTitle>
              <CardDescription>
                {data.files.length} file{data.files.length !== 1 ? "s" : ""}{" "}
                available
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <FileTable
                files={data.files}
                selectedUrls={selectedUrls}
                setSelectedUrls={setSelectedUrls}
              />
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Share Files
              </CardTitle>
              <CardDescription>Send selected files via email</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6">
                <MultiEmailInput
                  value={recipients}
                  onChange={setRecipients}
                  label="Recipient emails"
                  description="Add one or more addresses. We&#39;ll send each of them the same download links."
                  disabled={isSending}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        disabled={!canSend}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Send className="w-4 h-4" />
                        Send {selectedUrls.length} File
                        {selectedUrls.length !== 1 ? "s" : ""}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          Confirm File Sharing
                        </DialogTitle>
                        <DialogDescription>
                          You&#39;re sharing {selectedUrls.length} file
                          {selectedUrls.length !== 1 ? "s" : ""} with{" "}
                          {recipients.length} recipient
                          {recipients.length !== 1 ? "s" : ""}.
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
                            {selectedUrls.slice(0, 3).map((url, index) => (
                              <p
                                key={`${url}-${index}`}
                                className="truncate text-foreground/90"
                              >
                                {url}
                              </p>
                            ))}
                            {selectedUrls.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                + {selectedUrls.length - 3} more link
                                {selectedUrls.length - 3 !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={isSending}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSendEmails}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Confirm & Send"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="flex flex-wrap gap-2">
                    {selectedUrls.length > 0 && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setSelectedUrls([])}
                        className="text-destructive hover:text-destructive"
                      >
                        Clear Files
                      </Button>
                    )}
                    {recipients.length > 0 && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setRecipients([])}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Clear Recipients
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Page;
