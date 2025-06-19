"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUsers } from "@/database/mongodb/models/user.model";
import { FetchTeam } from "@/services/service";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Menu, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const TeamDetail = () => {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const params = useParams();
  const teamId = params?.teamId?.[0];

  const [showSidebar, setShowSidebar] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => FetchTeam(teamId!),
    enabled: !!teamId,
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }
  const isAccessDenied =
    user?.id !== data?.teamLeader.clerkId &&
    !data?.teamMembers.some((member: IUsers) => member.clerkId === user?.id);

  if (isAccessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have permission to view this team.
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
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Top bar for mobile */}
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

      {/* Center Content Area */}
      <div className="flex-1 overflow-y-auto bg-muted/20 p-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Team Workspace</CardTitle>
            <p className="text-sm text-muted-foreground">
              Welcome to your team dashboard! Here is some dummy content.
            </p>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              commodo, turpis a interdum posuere, erat lacus feugiat metus, et
              tincidunt erat lorem at sem. Nulla facilisi. Quisque et lorem
              turpis. Cras gravida urna non enim gravida malesuada.
            </p>
            <Separator className="my-4" />
            <p>
              More placeholder content can go here. This can be replaced with
              charts, task lists, or any kind of team-related tools.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div
        className={`w-full md:w-80 h-full overflow-y-auto border-l transition-transform duration-300 ease-in-out bg-background fixed md:relative top-0 right-0 z-50 md:translate-x-0 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 relative">
          {/* Close button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 md:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Back button on desktop */}
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
                  {data.teamName}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {data.teamId}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.teamDescription}
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Team Leader */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Team Leader
                </h3>
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={data.teamLeader.photo} />
                    <AvatarFallback>
                      {data.teamLeader.first_name?.[0]}
                      {data.teamLeader.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {data.teamLeader.first_name} {data.teamLeader.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {data.teamLeader.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Members */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Members ({data.teamMembers.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {data.teamMembers.map((member: IUsers) => (
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
    </div>
  );
};

export default TeamDetail;
