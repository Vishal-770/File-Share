"use client";

import { useUser } from "@clerk/nextjs";
import JSZip from "jszip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteFileDetails,
  DeleteMultipleFileDetails,
  FetchUser,
  getFileDetails,
  UpdateFileName,
  UpdatePassword,
} from "@/services/service";
import {
  File,
  ImageIcon,
  Search,
  Filter,
  Trash2,
  Download,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import React, { useState } from "react";
import FileDetails, { PasswordBody } from "@/types/FileType";
import StorageBar from "../_components/StorageBar";
import DeleteDialog from "./_components/DeleteDialog";
import RenameDialog from "./_components/RenameDialog";
import PasswordChangeDialog from "./_components/PasswordChangeDialog";

import { Input } from "@/components/ui/input";
import FileCard from "./_components/FileCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BulkDeleteDialog from "./_components/BulkDeleteDialog";
import BulkDownloadDialog from "./_components/BulkDownloadDialog";
import FilePageLoading from "./_components/FilePageLoading";
import FilePageError from "./_components/FilePageError";

const FileDisplayPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id;
  const queryClient = useQueryClient();

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordFileUrl, setPasswordFileUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fileType, setFileType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkDownloadDialog, setShowBulkDownloadDialog] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
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

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => DeleteMultipleFileDetails(ids),
    onSuccess: (_data, variables) => {
      // variables is the array of ids actually deleted
      toast.success(`${variables.length} file(s) deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["files", clerkId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // remove only those ids from selection (in case some remained selected purposely)
      setSelectedFileIds((prev) =>
        prev.filter((id) => !variables.includes(id))
      );
    },
    onError: (err, _vars) => {
      toast.error("Failed to delete files", {
        description: (err as Error).message || "Something went wrong",
        action: {
          label: "Retry",
          onClick: () => bulkDeleteMutation.mutate(_vars || []),
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
      refetch();
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

  const handleFileSelect = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFileIds(
        filteredFiles?.map((file: FileDetails) => file._id) || []
      );
    } else {
      setSelectedFileIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFileIds.length === 0) {
      toast.error("Please select at least one file to delete.");
      return;
    }
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDownload = () => {
    if (selectedFileIds.length === 0) {
      toast.error("Please select at least one file to download.");
      return;
    }
    setShowBulkDownloadDialog(true);
  };

  const multiDownload = async (ids: string[], asZip: boolean) => {
    if (!ids.length) return;
    setIsBulkDownloading(true);
    try {
      if (asZip) {
        const zip = new JSZip();
        let added = 0;
        for (const id of ids) {
          const file = data?.files?.find((f: FileDetails) => f._id === id);
          if (!file) continue;
          try {
            const res = await fetch(file.fileUrl);
            if (!res.ok) throw new Error("Failed to fetch file");
            const blob = await res.blob();
            // Ensure unique names inside zip
            const baseName = file.fileName || `file-${id}`;
            const existing = zip.file(baseName);
            const name = existing ? `${Date.now()}-${baseName}` : baseName;
            zip.file(name, blob);
            added++;
          } catch (err) {
            console.error("Zip add failed for", file?.fileName, err);
          }
        }
        if (added === 0) {
          toast.error("No files added to zip (all failed)");
        } else {
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(zipBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `files-${added}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success(`Downloaded zip with ${added} file(s)`);
        }
      } else {
        let success = 0;
        for (const id of ids) {
          const file = data?.files?.find((f: FileDetails) => f._id === id);
          if (!file) continue;
          try {
            const response = await fetch(file.fileUrl);
            if (!response.ok) throw new Error("File download failed");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            success += 1;
          } catch (err) {
            console.error("Download failed for", file?.fileName, err);
          }
        }
        toast.success(`Downloaded ${success} file(s)`);
      }
    } finally {
      setIsBulkDownloading(false);
      setShowBulkDownloadDialog(false);
    }
  };

  let filteredFiles = data?.files?.filter((file: FileDetails) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (fileType !== "All") {
    filteredFiles = filteredFiles?.filter(
      (file: FileDetails) => file.fileType === fileType
    );
  }

  if (!isLoaded || isLoading || isLoadingUser) {
    return <FilePageLoading />;
  }

  if (error || userError) {
    return <FilePageError queryClient={queryClient} clerkId={clerkId!} />;
  }

  const { current_storage_size, max_storage_size } = userData.user;
  const usagePercent = Math.min(
    (current_storage_size / max_storage_size) * 100,
    100
  );

  const fileTypes = [
    ...new Set(data?.files?.map((file: FileDetails) => file.fileType)),
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your Files
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage and organize your uploaded files
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-80"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {fileTypes.map((type) => (
                    <SelectItem key={type as string} value={type as string}>
                      {((type as string).split("/")[1] || type) as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "grid" | "list")}
              className="hidden sm:block"
            >
              <TabsList className="grid grid-cols-2 w-[120px]">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <StorageBar
          current_storage_size={current_storage_size}
          usagePercent={usagePercent}
          max_storage_size={max_storage_size}
        />

        {/* Bulk Actions */}
        {filteredFiles && filteredFiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={
                  selectedFileIds.length === filteredFiles.length &&
                  filteredFiles.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select all ({filteredFiles.length})
              </label>
            </div>
            <div className="flex items-center gap-3">
              {selectedFileIds.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selectedFileIds.length} selected
                  </span>
                  <Button
                    size="sm"
                    onClick={handleBulkDownload}
                    disabled={isBulkDownloading}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isBulkDownloading ? "Downloading..." : "Download"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {bulkDeleteMutation.isPending
                      ? "Deleting..."
                      : "Delete Selected"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredFiles?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center p-6">
          <Image
            src="/emptyfolder.webp"
            alt="No files"
            width={200}
            height={200}
            className="opacity-70"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-medium">
              {searchQuery || fileType !== "All"
                ? "No matching files found"
                : "Your file library is empty"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchQuery || fileType !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Upload your first file to get started"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm font-medium">
              {filteredFiles?.length}{" "}
              {filteredFiles?.length === 1 ? "file" : "files"}
            </Badge>
          </div>

          <div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                {filteredFiles?.map((file: FileDetails) => (
                  <FileCard
                    key={file._id}
                    file={file}
                    getFileIcon={getFileIcon}
                    setPasswordFileUrl={setPasswordFileUrl}
                    setRenameFileId={setRenameFileId}
                    setNewFileName={setNewFileName}
                    setSelectedFileUrl={setSelectedFileUrl}
                    setPassword={setPassword}
                    showCheckbox={true}
                    isSelected={selectedFileIds.includes(file._id)}
                    onFileSelect={handleFileSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {filteredFiles?.map((file: FileDetails) => (
                  <FileCard
                    key={file._id}
                    file={file}
                    getFileIcon={getFileIcon}
                    setPasswordFileUrl={setPasswordFileUrl}
                    setRenameFileId={setRenameFileId}
                    setNewFileName={setNewFileName}
                    setSelectedFileUrl={setSelectedFileUrl}
                    setPassword={setPassword}
                    showCheckbox={true}
                    isSelected={selectedFileIds.includes(file._id)}
                    onFileSelect={handleFileSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        selectedFileUrl={selectedFileUrl}
        setSelectedFileUrl={setSelectedFileUrl}
        handleDelete={handleDelete}
        deleteMutation={deleteMutation}
      />

      {/* Rename Dialog */}
      <RenameDialog
        renameFileId={renameFileId}
        setRenameFileId={setRenameFileId}
        renameMutation={renameMutation}
        setNewFileName={setNewFileName}
        handleRename={handleRename}
        newFileName={newFileName}
      />

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        passwordFileUrl={passwordFileUrl}
        setPasswordFileUrl={setPasswordFileUrl}
        password={password ?? " "}
        setPassword={setPassword}
        handleUpdatePassword={handleUpdatePassword}
        passwordMutation={passwordMutation}
      />

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        files={(filteredFiles || []).filter((f: FileDetails) =>
          selectedFileIds.includes(f._id)
        )}
        isDeleting={bulkDeleteMutation.isPending}
        onConfirm={(finalIds) => {
          bulkDeleteMutation.mutate(finalIds, {
            onSuccess: () => {
              setShowBulkDeleteDialog(false);
            },
          });
        }}
      />

      <BulkDownloadDialog
        open={showBulkDownloadDialog}
        onOpenChange={setShowBulkDownloadDialog}
        files={(filteredFiles || []).filter((f: FileDetails) =>
          selectedFileIds.includes(f._id)
        )}
        isDownloading={isBulkDownloading}
        onConfirm={(finalIds, asZip) => multiDownload(finalIds, asZip)}
      />
    </div>
  );
};

export default FileDisplayPage;
