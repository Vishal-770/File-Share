"use client";

import { Button } from "@/components/ui/button";
import { CreateTeam, FetchUser, JoinTeam } from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Teams from "./_components/Teams";

interface TeamFormData {
  teamName: string;
  teamDescription: string;
}

interface JoinFormData {
  teamId: string;
}

const TeamPage = () => {
  const { isLoaded, user, isSignedIn } = useUser();
  const { register, handleSubmit, reset } = useForm<TeamFormData>();
  const {
    register: joinRegister,
    handleSubmit: handleJoinSubmit,
    reset: joinReset,
  } = useForm<JoinFormData>();

  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const queryClient = useQueryClient();

  const CreateTeamMutation = useMutation({
    mutationFn: CreateTeam,
  });

  const JoinTeamMutation = useMutation({
    mutationFn: JoinTeam,
  });

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => FetchUser(user!.id),
    enabled: isLoaded && isSignedIn,
  });

  const onSubmit = (data: TeamFormData) => {
    CreateTeamMutation.mutate(
      {
        teamName: data.teamName,
        teamDescription: data.teamDescription,
        clerkId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          toast.success("✅ Team created successfully");
          queryClient.invalidateQueries({ queryKey: ["user"] });
          refetch();
          reset();
          setOpen(false);
          window.location.reload();
        },
        onError: (err) => {
          toast.error(`❌ Error creating team: ${err.message}`);
        },
      }
    );
  };

  const onJoinSubmit = (data: JoinFormData) => {
    JoinTeamMutation.mutate(
      {
        teamId: data.teamId,
        clerkId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Joined team successfully");
          queryClient.invalidateQueries({ queryKey: ["user"] });
          refetch();
          joinReset();
          setJoinOpen(false);
        },
        onError: (err: unknown) => {
          let errorMessage = "An error occurred while joining the team.";
          type ErrorResponse = {
            response?: {
              data?: {
                message?: string;
              };
            };
          };
          const errorObj = err as ErrorResponse;
          if (
            errorObj &&
            typeof errorObj === "object" &&
            errorObj.response &&
            typeof errorObj.response === "object" &&
            errorObj.response.data &&
            typeof errorObj.response.data === "object" &&
            errorObj.response.data.message
          ) {
            errorMessage = `Failed to join team: ${errorObj.response.data.message}`;
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  if (!isLoaded || isLoading)
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );

  const teams: string[] = userData?.user?.teams ?? [];

  return (
    <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-primary">
          Manage Your Files with Your Team
        </h1>
        <p className="text-primary max-w-xl mx-auto">
          Collaborate, upload, and manage files efficiently within your teams.
        </p>
      </header>

      <div className="flex justify-end gap-4 mb-6">
        {/* Create Team Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Team</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
                <DialogDescription>
                  Provide a name and description for your new team.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    {...register("teamName")}
                    required
                    placeholder="e.g. Dev Squad"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamDescription">Description</Label>
                  <Input
                    id="teamDescription"
                    {...register("teamDescription")}
                    required
                    placeholder="e.g. Backend development team"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={CreateTeamMutation.isPending}>
                  {CreateTeamMutation.isPending ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Join Team Dialog */}
        <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Join Team</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <form
              onSubmit={handleJoinSubmit(onJoinSubmit)}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle>Join a Team</DialogTitle>
                <DialogDescription>
                  Enter a valid Team ID to join an existing team.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teamId">Team ID</Label>
                  <Input
                    id="teamId"
                    {...joinRegister("teamId")}
                    required
                    placeholder="e.g. abcd1234"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={JoinTeamMutation.isPending}>
                  {JoinTeamMutation.isPending ? "Joining..." : "Join Team"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Your Teams
        </h2>
        {teams.length === 0 ? (
          <p className="text-primary">You’re not part of any teams yet.</p>
        ) : (
          <Teams userId={user?.id ?? " "} teamIds={teams} />
        )}
      </section>
    </div>
  );
};

export default TeamPage;
