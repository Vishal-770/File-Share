"use client";

import { getFileDetails } from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { SendEmail } from "@/services/service"; // Adjust path as per your project
import { toast } from "sonner";
import React, { useState } from "react";
import FileTable from "./_components/FileTable";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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

interface Data {
  email: string;
}

const Page = () => {
  const { isLoaded, user } = useUser();
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["files", user?.id],
    queryFn: () => getFileDetails(user!.id),
    enabled: isLoaded && !!user?.id,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Data>();

  const email = watch("email");
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSend = isEmailValid && selectedUrls.length > 0;

  const onSubmit = async (formData: Data) => {
    setIsSending(true);
    try {
      await SendEmail({
        recipientEmail: formData.email,
        senderName:
          user?.firstName ||
          user?.emailAddresses[0]?.emailAddress ||
          "Anonymous",
        shareUrls: selectedUrls,
      });

      toast.success("Email sent successfully!");
      reset();
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
              <form className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    placeholder="recipient@example.com"
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
                          You&#39;re about to share {selectedUrls.length} file
                          {selectedUrls.length !== 1 ? "s" : ""} with:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="font-medium">{email}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={isSending}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit(onSubmit)}
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

                  {selectedUrls.length > 0 && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setSelectedUrls([])}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear Selection
                    </Button>
                  )}
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
