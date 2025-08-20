"use client";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { JoinTeam } from "@/services/service";
import { Loader2, Users } from "lucide-react";

interface PublicTeamUser {
  clerkId: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}
interface PublicTeam {
  teamName: string;
  teamDescription: string;
  teamId: string;
  isPublic: boolean;
  teamLeader?: PublicTeamUser;
  teamMembers?: PublicTeamUser[];
}

export default function PublicTeamsPage() {
  const { user, isLoaded } = useUser();
  const [teams, setTeams] = useState<PublicTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const fetchTeams = async (q?: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/public-teams${q ? `?q=${encodeURIComponent(q)}` : ""}`
      );
      const data = await res.json();
      if (data.success) setTeams(data.teams || []);
      else toast.error(data.message || "Failed to load public teams");
    } catch {
      toast.error("Error loading public teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fetchTeams();
  }, [isLoaded]);

  const filtered = useMemo(() => {
    if (!search) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) =>
        t.teamName.toLowerCase().includes(q) ||
        t.teamDescription.toLowerCase().includes(q) ||
        t.teamId.toLowerCase().includes(q)
    );
  }, [teams, search]);

  const joinMutation = useMutation({
    mutationFn: async (teamId: string) => {
      await JoinTeam({ teamId, clerkId: user!.id });
    },
    onSuccess: () => {
      toast.success("Joined team successfully");
      setJoiningId(null);
      fetchTeams(search);
    },
    onError: (err: unknown) => {
      interface AxiosErrLike {
        response?: { data?: { message?: string } };
      }
      const axErr = err as AxiosErrLike;
      const msg = axErr?.response?.data?.message || "Failed joining team";
      toast.error(msg);
      setJoiningId(null);
    },
  });

  const handleJoin = (teamId: string) => {
    if (!user) return toast.error("Sign in required");
    setJoiningId(teamId);
    joinMutation.mutate(teamId);
  };

  return (
    <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Public Teams</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and join open collaboration spaces instantly.
        </p>
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search public teams (name, description, ID)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <Users className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            No public teams match your search.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              fetchTeams();
            }}
          >
            Reset
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => {
            const memberCount = team.teamMembers?.length || 0;
            const alreadyMember =
              team.teamMembers?.some((m) => m.clerkId === user?.id) ||
              team.teamLeader?.clerkId === user?.id;
            return (
              <Card key={team.teamId} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate" title={team.teamName}>
                    {team.teamName}
                  </CardTitle>
                  <CardDescription
                    className="line-clamp-2"
                    title={team.teamDescription}
                  >
                    {team.teamDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="text-xs text-muted-foreground">
                    ID: {team.teamId}
                  </div>
                  <div className="text-sm">Members: {memberCount+1}</div>
                  {alreadyMember ? (
                    <Button variant="secondary" disabled className="w-full">
                      Already Member
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        joiningId === team.teamId || joinMutation.isPending
                      }
                      onClick={() => handleJoin(team.teamId)}
                      className="w-full"
                    >
                      {joiningId === team.teamId ? "Joining..." : "Join"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
