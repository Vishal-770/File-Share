"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteTeam, FetchTeams } from "@/services/service";
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
import { Users, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface TeamLeader {
  first_name: string;
  last_name: string;
  email: string;
}

interface Team {
  _id: string;
  teamName: string;
  teamDescription: string;
  teamId: string;
  teamLeader: TeamLeader | null;
}

const Teams = ({ teamIds }: { teamIds: string[] }) => {
  const { data, isLoading, isError, refetch } = useQuery<{ data: Team[] }>({
    queryKey: ["teams"],
    queryFn: () => FetchTeams(teamIds),
  });

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const { mutate: deleteTeam, isPending: isDeleting } = useMutation({
    mutationFn: DeleteTeam,
    onSuccess: () => {
      setOpenDialogId(null);
      refetch();
    },
    onError: () => {
      alert("Failed to delete team. Please try again.");
    },
  });

  const teams = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="shadow-md border rounded-2xl p-4 space-y-4"
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
          Please check your internet or try again.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center p-10 text-muted-foreground text-sm">
        No teams found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team._id} className="shadow-md border rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-semibold">
                {team.teamName}
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Team ID: {team.teamId}
            </p>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{team.teamDescription}</p>

            <div className="space-y-3">
              {team.teamLeader ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Team Leader</p>
                  <p className="text-gray-700">
                    {team.teamLeader.first_name} {team.teamLeader.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {team.teamLeader.email}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  No Team Leader Assigned
                </p>
              )}

              <Dialog
                open={openDialogId === team._id}
                onOpenChange={(open) => setOpenDialogId(open ? team._id : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Confirm Team Deletion
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      Are you sure you want to delete{" "}
                      <strong>{team.teamName}</strong>? This action is permanent
                      and cannot be undone.
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
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Confirm Delete
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Teams;
