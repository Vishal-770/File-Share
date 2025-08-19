"use client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IUsers } from "@/database/mongodb/models/user.model";
import {
  DelteTeamFile,
  FetchTeam,
  getFileDetails,
  UploadFilesToTeam,
} from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Eye,
  File,
  Lock,
  Mail,
  Menu,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import TeamBulkDownloadDialog from "../_components/TeamBulkDownloadDialog";
import TeamBulkDeleteDialog from "../_components/TeamBulkDeleteDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { handleDownload } from "@/utils/functions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileItem {
  _id: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  clerkId: string;
}

const TeamDetail = () => {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const params = useParams();
  const teamId = params?.teamId?.[0];
  const clerkId = user?.id;
  const [showSidebar, setShowSidebar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  // Selection of personal (user) files to add into team
  const [selectedUserFileIds, setSelectedUserFileIds] = useState<string[]>([]);
  // Selection of existing team files for bulk actions (download / delete)
  const [selectedTeamFileIds, setSelectedTeamFileIds] = useState<string[]>([]);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const {
    data: teamData,
    isLoading: isTeamLoading,
    refetch,
  } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => FetchTeam(teamId!),
    enabled: !!teamId,
  });

  const {
    data: fileData,
    isLoading: isFilesLoading,
    error: fileError,
  } = useQuery({
    queryKey: ["files", clerkId],
    queryFn: () => getFileDetails(clerkId!),
    enabled: isLoaded && !!clerkId,
  });

  // Mutation
  const AddFileMutation = useMutation({
    mutationFn: async () =>
      UploadFilesToTeam({
        teamId: teamData.teamId,
  fileIds: selectedUserFileIds,
      }),
    onSuccess: () => {
      toast.success("Files added to team successfully.");
      setDialogOpen(false);
  setSelectedUserFileIds([]);
      refetch();
    },
    onError: () => {
      toast.error("Failed to add files to the team.");
    },
  });

  const DeleteFileMutation = useMutation({
    mutationFn: DelteTeamFile,
    onSuccess: () => {
      toast.success("File deleted successfully");
      setDialogOpen1(false);
      setFileToDelete(null);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete file from the team.");
    },
  });

  const isAccessDenied =
    !isTeamLoading &&
    user?.id !== teamData?.teamLeader.clerkId &&
    !teamData?.teamMembers.some(
      (member: IUsers) => member.clerkId === user?.id
    );

  // Personal files selection handlers (add to team)
  const handleUserFileSelect = (fileId: string) => {
    setSelectedUserFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };
  const handleUserSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserFileIds(
        fileData?.files?.map((file: FileItem) => file.fileId) || []
      );
    } else {
      setSelectedUserFileIds([]);
    }
  };
  // Team files selection handlers (bulk actions)
  const handleTeamFileSelect = (fileId: string) => {
    setSelectedTeamFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleAddFiles = async () => {
  if (selectedUserFileIds.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    if (!teamData?.teamId) {
      toast.error("Team ID is missing.");
      return;
    }

    AddFileMutation.mutate();
  };

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setDialogOpen1(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete || !teamId) {
      toast.error("Missing required information for deletion.");
      return;
    }

    DeleteFileMutation.mutate({
      fileId: fileToDelete.fileId,
      teamId,
    });
  };

  if (fileError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-background rounded-lg border">
          <h1 className="text-2xl font-bold mb-4">Error Loading Files</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the files. Please try again later.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );

  if (!isLoaded || isTeamLoading || isFilesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/loading.gif" alt="loading" height={50} width={50} />
          <p className="text-sm text-muted-foreground">
            Loading team details...
          </p>
        </div>
      </div>
    );
  }

  if (isAccessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-background rounded-lg border">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&#39;t have permission to view this team. Please contact the
            team leader if you believe this is an error.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const files = fileData?.files || [];
  const files_not_in_team = files.filter((file: FileItem) => {
    return !teamData.files.some(
      (teamFile: FileItem) => teamFile.fileId === file.fileId
    );
  });

  // Helper: selected team files (intersection)
  const selectedTeamFiles: FileItem[] =
    teamData?.files?.filter((f: FileItem) =>
      selectedTeamFileIds.includes(f.fileId)
    ) || [];
  const canUserDelete = (f: FileItem) => f.clerkId === user?.id; // only uploader can delete
  const deletableSelected = selectedTeamFiles.filter(canUserDelete);
  const blockedCount = selectedTeamFiles.length - deletableSelected.length;

  const openBulkDownload = () => {
    if (selectedTeamFiles.length === 0) {
      toast.error("Select at least one team file.");
      return;
    }
    setShowBulkDownload(true);
  };

  const openBulkDelete = () => {
    if (selectedTeamFiles.length === 0) {
      toast.error("Select at least one team file.");
      return;
    }
    if (deletableSelected.length === 0) {
      toast.error("You don't have permission to delete the selected files.");
      return;
    }
    setShowBulkDelete(true);
  };

  const performBulkDelete = async (ids: string[]) => {
    if (!ids.length) return;
    setIsBulkDeleting(true);
    let success = 0;
    for (const id of ids) {
      const file = teamData.files.find((f: FileItem) => f.fileId === id);
      if (!file || !canUserDelete(file)) continue;
      try {
        await DelteTeamFile({ fileId: id, teamId: teamId as string });
        success++;
      } catch (err) {
        console.error("Failed deleting", file.fileName, err);
      }
    }
    if (success > 0) {
      toast.success(`Deleted ${success} file(s)`);
      refetch();
    } else {
      toast.error("No files deleted");
    }
    setIsBulkDeleting(false);
    setShowBulkDelete(false);
  setSelectedTeamFileIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile header */}
      <div className="flex justify-between items-center p-4 md:hidden border-b bg-background z-40">
        <Button variant="ghost" onClick={() => router.back()} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
        <div className="space-y-6 w-full h-full">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-2xl font-bold">
              {teamData?.teamName} Workspace
            </h1>
            <Button onClick={() => setDialogOpen(true)}>Add Files</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Team Files</CardTitle>
            </CardHeader>
            <CardContent>
              {teamData?.files?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamData.files.map((file: FileItem) => (
                    <div
                      key={file.fileId}
                      className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-background flex flex-col h-full"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-muted rounded-lg p-3 flex-shrink-0">
                          <File className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.fileType}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="sr-only sm:not-sr-only">
                              Preview
                            </span>
                          </Button>
                        </a>
                        <Button
                          onClick={() =>
                            handleDownload(file.fileUrl, file.fileName)
                          }
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs h-8"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="sr-only sm:not-sr-only">
                            Download
                          </span>
                        </Button>
                        <Checkbox
                          checked={selectedTeamFileIds.includes(file.fileId)}
                          onCheckedChange={() => handleTeamFileSelect(file.fileId)}
                          className="h-4 w-4 ml-auto"
                        />
                        {file.clerkId === user?.id ? (
                          <Button
                            onClick={() => handleDeleteClick(file)}
                            variant="destructive"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="sr-only sm:not-sr-only">
                              Delete
                            </span>
                          </Button>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground self-center">
                                <Lock className="w-3.5 h-3.5 inline mr-1" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Only the uploader can delete this file</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <File className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No files added yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This team doesn&#39;t have any files yet. Add some files to
                    get started with collaboration.
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>Add Files</Button>
                </div>
              )}
              {teamData?.files?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id="select-team-all"
                      checked={
                        selectedTeamFileIds.length === teamData.files.length &&
                        teamData.files.length > 0
                      }
                      onCheckedChange={(checked) =>
                        checked
                          ? setSelectedTeamFileIds(
                              teamData.files.map((f: FileItem) => f.fileId)
                            )
                          : setSelectedTeamFileIds([])
                      }
                    />
                    <label htmlFor="select-team-all" className="cursor-pointer">
                      Select All ({teamData.files.length})
                    </label>
                    {selectedTeamFileIds.length > 0 && (
                      <span className="text-muted-foreground ml-2">
                        {selectedTeamFileIds.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTeamFiles.length > 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={openBulkDownload}
                        >
                          Bulk Download
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={openBulkDelete}
                          disabled={
                            isBulkDeleting || deletableSelected.length === 0
                          }
                        >
                          {isBulkDeleting
                            ? "Deleting..."
                            : `Bulk Delete${blockedCount > 0 ? ` (${deletableSelected.length} allowed)` : ""}`}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`w-full md:w-80 h-full overflow-y-auto border-l transition-transform duration-300 ease-in-out bg-background fixed md:relative top-0 right-0 z-50 md:translate-x-0 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 md:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full justify-start hidden md:flex"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>

          <Card className="bg-background">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {teamData.teamName}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {teamData.teamId}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {teamData.teamDescription}
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Team Leader
                </h3>
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teamData.teamLeader.photo} />
                    <AvatarFallback>
                      {teamData.teamLeader.first_name?.[0]}
                      {teamData.teamLeader.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {teamData.teamLeader.first_name}{" "}
                      {teamData.teamLeader.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {teamData.teamLeader.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Members ({teamData.teamMembers.length})
                </h3>
                <div className="space-y-2">
                  {teamData.teamMembers.map((member: IUsers) => (
                    <div
                      key={member.clerkId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.first_name?.[0]}
                          {member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File selection dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Files to Add</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedUserFileIds.length === fileData?.files?.length &&
                    fileData?.files?.length > 0
                  }
                  onCheckedChange={handleUserSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select all
                </label>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedUserFileIds.length} of {fileData?.files?.length} selected
              </span>
            </div>

            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {files_not_in_team.length > 0 ? (
                files_not_in_team.map((file: FileItem) => (
                  <div
                    key={file.fileId}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleUserFileSelect(file.fileId)}
                  >
                    <Checkbox
                      checked={selectedUserFileIds.includes(file.fileId)}
                      onCheckedChange={() => handleUserFileSelect(file.fileId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-muted rounded-md p-2">
                        <File className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {file.fileType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                  <File className="w-10 h-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No files available</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven&#39;t uploaded any files yet. Upload files to
                    share them with your team, or All ur Files Are Already
                    Shared In this Team
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFiles}
              disabled={
                selectedUserFileIds.length === 0 ||
                files_not_in_team.length === 0
              }
            >
              Add Selected Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-destructive/20 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete File</DialogTitle>
                <DialogDescription className="mt-1">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {fileToDelete?.fileName}
              </span>{" "}
              from this team?
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen1(false);
                setFileToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={DeleteFileMutation.isPending}
            >
              {DeleteFileMutation.isPending ? "Deleting..." : "Delete File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TeamBulkDownloadDialog
        open={showBulkDownload}
        onOpenChange={setShowBulkDownload}
        files={selectedTeamFiles.map((f) => ({
          fileId: f.fileId,
          fileName: f.fileName,
          fileUrl: f.fileUrl,
          fileType: f.fileType,
        }))}
        teamName={teamData?.teamName}
      />
      <TeamBulkDeleteDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
        files={deletableSelected.map((f) => ({
          fileId: f.fileId,
          fileName: f.fileName,
          fileType: f.fileType,
          fileUrl: f.fileUrl,
        }))}
        isDeleting={isBulkDeleting}
        blockedCount={blockedCount}
        onConfirm={performBulkDelete}
      />
    </div>
  );
};

export default TeamDetail;
