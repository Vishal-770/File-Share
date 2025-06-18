"use client";

import { Button } from "@/components/ui/button";
import { CreateTeam, FetchUser } from "@/services/service";
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

const TeamPage = () => {
  const { isLoaded, user, isSignedIn } = useUser();
  const { register, handleSubmit, reset } = useForm<TeamFormData>();
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const CreateTeamMutation = useMutation({
    mutationFn: CreateTeam,
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

  const onSubmit = async (data: TeamFormData) => {
    CreateTeamMutation.mutate(
      {
        teamName: data.teamName,
        teamDescription: data.teamDescription,
        clerkId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Team created successfully");
          queryClient.invalidateQueries({ queryKey: ["user"] });
          queryClient.invalidateQueries({ queryKey: ["teams"] });
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
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
          Manage Your Files with Your Team
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Collaborate, upload, and manage files efficiently within your teams.
        </p>
      </header>

      <div className="flex justify-end mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Team</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
                <DialogDescription>
                  Give your team a name and a short description.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    {...register("teamName")}
                    required
                    placeholder="e.g. Product Squad"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamDescription">Description</Label>
                  <Input
                    id="teamDescription"
                    {...register("teamDescription")}
                    required
                    placeholder="What does your team do?"
                  />
                </div>
              </div>

              <DialogFooter className="mt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button disabled={CreateTeamMutation.isPending} type="submit">
                  {CreateTeamMutation.isPending ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Teams
        </h2>
        {teams.length === 0 ? (
          <p className="text-gray-600">You’re not part of any teams yet.</p>
        ) : (
          <Teams teamIds={teams} />
        )}
      </section>
    </div>
  );
};

export default TeamPage;
