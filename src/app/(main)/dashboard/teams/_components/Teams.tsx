"use client";

import { FetchTeams } from "@/services/service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data, isLoading } = useQuery<{ data: Team[] }>({
    queryKey: ["teams"],
    queryFn: () => FetchTeams(teamIds),
  });

  const teams = data?.data || [];

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
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
          ))
        : teams.map((team) => (
            <Card key={team._id} className="shadow-md border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {team.teamName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ID: <span className="text-gray-600">{team.teamId}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{team.teamDescription}</p>

                {team.teamLeader ? (
                  <div className="text-sm text-gray-700 mt-4">
                    <p className="font-medium">Team Leader:</p>
                    <p>
                      {team.teamLeader.first_name} {team.teamLeader.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {team.teamLeader.email}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-500 mt-4">
                    No Team Leader Assigned
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

export default Teams;
