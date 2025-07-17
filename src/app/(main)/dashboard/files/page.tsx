"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteFileDetails,
  FetchUser,
  getFileDetails,
  UpdateFileName,
  UpdatePassword,
} from "@/services/service";
import { File, ImageIcon, Search, Filter } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import React, { useState } from "react";
import FileDetails, { PasswordBody } from "@/types/FileType";
import StorageBar from "../_components/StorageBar";
import DeleteDialog from "./_components/DeleteDialog";
import RenameDialog from "./_components/RenameDialog";
import PasswordChangeDialog from "./_components/PasswordChangeDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const FileDisplayPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id;
  const queryClient = useQueryClient();

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordFileUrl, setPasswordFileUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fileType, setFileType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  let filteredFiles = data?.files?.filter((file: FileDetails) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (fileType !== "All") {
    filteredFiles = filteredFiles?.filter(
      (file: FileDetails) => file.fileType === fileType
    );
  }

  if (!isLoaded || isLoading || isLoadingUser) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || userError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center p-6">
        <Image
          src="/error.svg"
          alt="Error"
          width={200}
          height={200}
          className="opacity-80"
        />
        <h2 className="text-2xl font-bold text-red-500">
          Failed to fetch files
        </h2>
        <p className="text-muted-foreground max-w-md">
          We couldn&#39;t load your files. Please check your connection and try
          again.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.refetchQueries({ queryKey: ["files", clerkId] })
          }
        >
          Retry
        </Button>
      </div>
    );
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

          <ScrollArea className="h-full">
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
                  />
                ))}
              </div>
            )}
          </ScrollArea>
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
        password={password}
        setPassword={setPassword}
        handleUpdatePassword={handleUpdatePassword}
        passwordMutation={passwordMutation}
      />
    </div>
  );
};

export default FileDisplayPage;
