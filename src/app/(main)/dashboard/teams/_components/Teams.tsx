"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteTeam, FetchTeams, LeaveTeam } from "@/services/service";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Trash2,
  AlertTriangle,
  Loader2,
  LogOut,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface TeamLeader {
  first_name: string;
  last_name: string;
  email: string;
  clerkId: string;
}

export interface Team {
  _id: string;
  teamName: string;
  teamDescription: string;
  teamId: string;
  teamLeader: TeamLeader | null;
}

const Teams = ({ teamIds, userId }: { teamIds: string[]; userId: string }) => {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [leaveDialogId, setLeaveDialogId] = useState<string | null>(null);
  const [copiedTeamId, setCopiedTeamId] = useState<string | null>(null);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery<{ data: Team[] }>({
    queryKey: ["teams"],
    queryFn: () => FetchTeams(teamIds),
  });

  const { mutate: deleteTeam, isPending: isDeleting } = useMutation({
    mutationFn: DeleteTeam,
    onSuccess: () => {
      toast.success("Team deleted successfully");
      setOpenDialogId(null);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete team. Please try again.");
    },
  });

  const { mutate: leaveTeam, isPending: isLeaving } = useMutation({
    mutationFn: LeaveTeam,
    onSuccess: () => {
      toast.success("Left team successfully");
      setLeaveDialogId(null);
      refetch();
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to leave team. Please try again.");
    },
  });

  const handleCopyTeamId = (teamId: string) => {
    navigator.clipboard.writeText(teamId);
    setCopiedTeamId(teamId);
    toast.success("Team ID copied to clipboard");
    setTimeout(() => setCopiedTeamId(null), 2000);
  };

  const teams = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="shadow-sm border rounded-lg p-4 space-y-4"
          >
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-4 w-full rounded mt-2" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium">Failed to load teams</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your internet connection and try again.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Users className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          You&#39;re not part of any teams yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => {
        const isLeader = team?.teamLeader?.clerkId === userId;
        const isTeamIdCopied = copiedTeamId === team.teamId;

        return (
          <Card
            key={team._id}
            className="shadow-sm border rounded-lg hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  {team.teamName}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  ID: {team.teamId}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-muted-foreground hover:text-primary"
                  onClick={() => handleCopyTeamId(team.teamId)}
                >
                  {isTeamIdCopied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {team.teamDescription || "No description provided"}
              </p>

              <div className="space-y-3">
                {team.teamLeader ? (
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Team Leader</p>
                    <p className="text-muted-foreground">
                      {team.teamLeader.first_name} {team.teamLeader.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {team.teamLeader.email}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    No Team Leader Assigned
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => router.push(`/dashboard/teams/${team.teamId}`)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>

                <div className="flex flex-col gap-2 mt-4">
                  {isLeader ? (
                    <Dialog
                      open={openDialogId === team._id}
                      onOpenChange={(open) =>
                        setOpenDialogId(open ? team._id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Delete Team
                          </DialogTitle>
                          <DialogDescription className="pt-2">
                            This will permanently delete{" "}
                            <span className="font-semibold">
                              {team.teamName}
                            </span>{" "}
                            and all its data. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setOpenDialogId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteTeam(team._id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog
                      open={leaveDialogId === team._id}
                      onOpenChange={(open) =>
                        setLeaveDialogId(open ? team._id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Leave Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Leave Team
                          </DialogTitle>
                          <DialogDescription className="pt-2">
                            You&#39;re about to leave{" "}
                            <span className="font-semibold">
                              {team.teamName}
                            </span>
                            . You won&#39;t be able to access team files unless
                            you&#39;re re-invited.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setLeaveDialogId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              leaveTeam({
                                teamId: team.teamId,
                                clerkId: userId,
                              })
                            }
                            disabled={isLeaving}
                          >
                            {isLeaving ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <LogOut className="w-4 h-4 mr-2" />
                            )}
                            {isLeaving ? "Leaving..." : "Leave Team"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Teams;
