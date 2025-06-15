"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteFileDetails,
  FetchUser,
  getFileDetails,
  UpdateFileName,
  UpdatePassword,
} from "@/services/service";
import { format } from "date-fns";
import { Download, Eye, Trash2, Pencil, Lock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import FileDetails, { PasswordBody } from "@/types/FileType";
import { handleDownload } from "@/utils/functions";
import { Input } from "@/components/ui/input";

import { DialogTrigger } from "@radix-ui/react-dialog";
import StorageBar from "../_components/StorageBar";

const FileTablePage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id;
  const queryClient = useQueryClient();

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordFileUrl, setPasswordFileUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["files", clerkId],
    queryFn: () => getFileDetails(clerkId!),
    enabled: isLoaded && !!clerkId,
  });
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => FetchUser(user!.id),
    enabled: isLoaded && isSignedIn,
  });
  const deleteMutation = useMutation({
    mutationFn: DeleteFileDetails,
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["files", clerkId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setSelectedFileUrl(null);
    },
    onError: (err, fileUrl) => {
      toast.error("Failed to delete file", {
        description: (err as Error).message || "Something went wrong",
        action: {
          label: "Retry",
          onClick: () => deleteMutation.mutate(fileUrl),
        },
      });
    },
  });

  const renameMutation = useMutation({
    mutationFn: UpdateFileName,
    onSuccess: () => {
      toast.success("File renamed successfully");
      queryClient.invalidateQueries({ queryKey: ["files", clerkId] });
      setRenameFileId(null);
      setNewFileName("");
    },
    onError: (err) => {
      toast.error("Rename failed", {
        description: (err as Error).message || "Something went wrong",
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: () => {
      toast.success("Password updated successfully");
      queryClient.invalidateQueries({ queryKey: ["files", clerkId] });
      setPassword(null);
      setPasswordFileUrl(null);
    },
    onError: (err) => {
      toast.error("Password update failed", {
        description: (err as Error).message || "Something went wrong",
      });
    },
  });

  const handleUpdatePassword = (data: PasswordBody) => {
    passwordMutation.mutate(data);
  };

  const handleDelete = () => {
    if (selectedFileUrl) {
      deleteMutation.mutate(selectedFileUrl);
    }
  };

  const handleRename = () => {
    if (renameFileId && newFileName.trim()) {
      renameMutation.mutate({ _id: renameFileId, fileName: newFileName });
    }
  };

  if (!isLoaded || isLoading || isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }

  if (error || userError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-red-500 text-lg">
        Failed to fetch files. Please try again later.
      </div>
    );
  }
  const { current_storage_size, max_storage_size } = userData.user;
  const usagePercent = Math.min(
    (current_storage_size / max_storage_size) * 100,
    100
  );
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Your Uploaded Files</h2>
        <StorageBar
          current_storage_size={current_storage_size}
          usagePercent={usagePercent}
          max_storage_size={max_storage_size}
        />
      </div>

      {data?.files?.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10 text-base sm:text-lg">
          You haven&#39;t uploaded any files yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.files.map((file: FileDetails) => (
                <TableRow key={file._id}>
                  <TableCell className="max-w-[200px] truncate">
                    {file.fileName}
                  </TableCell>
                  <TableCell>{file.fileType}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    {format(new Date(file.createdAt), "dd MMM yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{file?.password ?? "No Password Set"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(file.fileUrl, file.fileName)
                      }
                    >
                      <Download className="w-4 h-4 mr-1" />
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={file.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRenameFileId(file._id);
                        setNewFileName(file.fileName);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPassword(""); // Clear old value
                        setPasswordFileUrl(file.fileUrl);
                      }}
                    >
                      <Lock className="w-4 h-4 mr-1" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Copy & Share</DialogTitle>
                          <DialogDescription className="pb-2">
                            Share this link with others
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={`${process.env.NEXT_PUBLIC_BASE_URL}/share?fileId=${file.fileId}`}
                            readOnly
                            className="w-full"
                            id={`share-link-${file._id}`}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const url = `${process.env.NEXT_PUBLIC_BASE_URL}/share?fileId=${file.fileId}`;
                              navigator.clipboard.writeText(url);
                              toast.success("Link copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedFileUrl(file._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={!!selectedFileUrl}
        onOpenChange={() => setSelectedFileUrl(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              file.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedFileUrl(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renameFileId} onOpenChange={() => setRenameFileId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter the new name for the file.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter new file name"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameFileId(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleRename}
                disabled={renameMutation.isPending || !newFileName.trim()}
              >
                {renameMutation.isPending ? "Renaming..." : "Rename"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        open={!!passwordFileUrl}
        onOpenChange={() => setPasswordFileUrl(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Password</DialogTitle>
            <DialogDescription>Enter password for this file</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Input
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              type="password"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setPasswordFileUrl(null)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() =>
                  handleUpdatePassword({
                    fileUrl: passwordFileUrl!,
                    password: password!,
                  })
                }
                disabled={passwordMutation.isPending || !password?.trim()}
              >
                {passwordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileTablePage;
