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
import { DeleteFileDetails, getFileDetails } from "@/services/service";
import { format } from "date-fns";
import { Download, Eye, Trash2 } from "lucide-react";
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
import FileDetails from "@/types/FileType";
import { handleDownload } from "@/utils/functions";

const FileTablePage = () => {
  const { user, isLoaded } = useUser();
  const clerkId = user?.id;
  const queryClient = useQueryClient();

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["files", clerkId],
    queryFn: () => getFileDetails(clerkId!),
    enabled: isLoaded && !!clerkId,
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteFileDetails,
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["files", clerkId] });
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

  const handleDelete = () => {
    if (selectedFileUrl) {
      deleteMutation.mutate(selectedFileUrl);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-red-500 text-lg">
        Failed to fetch files. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Your Uploaded Files
      </h2>

      {data?.files?.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10 text-base sm:text-lg">
          You haven&#39;t uploaded any files yet.
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {data.files.map((file: FileDetails) => (
              <div
                key={file._id}
                className="p-4 border rounded-lg shadow-sm text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium truncate max-w-[180px]">
                    {file.fileName}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDownload(file.fileUrl, file.fileName)
                      }
                      className="h-8 w-8"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <a
                        href={file.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setSelectedFileUrl(file._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="font-medium">Type:</span> {file.fileType}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>{" "}
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                  <div>
                    <span className="font-medium">Uploaded:</span>{" "}
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded At</TableHead>
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
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownload(file.fileUrl, file.fileName)
                        }
                        className="h-8"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        <span className="sr-only sm:not-sr-only">Download</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8"
                      >
                        <a
                          href={file.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="sr-only sm:not-sr-only">View</span>
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedFileUrl(file._id)}
                        className="h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="sr-only sm:not-sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
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
            <Button
              variant="outline"
              onClick={() => setSelectedFileUrl(null)}
              disabled={deleteMutation.isPending}
            >
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
    </div>
  );
};

export default FileTablePage;
