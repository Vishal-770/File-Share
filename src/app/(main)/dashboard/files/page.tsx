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
import { Download, Trash2 } from "lucide-react";
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

interface FileDetails {
  _id: string;
  fileName: string;
  fileType: string;
  size: number;
  createdAt: string;
  fileUrl: string;
}

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Uploaded Files</h2>

      {data?.files?.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10 text-lg">
          You haven’t uploaded any files yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size (KB)</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.files.map((file: FileDetails) => (
              <TableRow key={file._id}>
                <TableCell className="max-w-[200px] truncate">
                  {file.fileName}
                </TableCell>
                <TableCell>{file.fileType}</TableCell>
                <TableCell>{(file.size / 1024).toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(file.createdAt), "dd MMM yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedFileUrl(file._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={!!selectedFileUrl}
        onOpenChange={() => setSelectedFileUrl(null)}
      >
        <DialogContent>
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
