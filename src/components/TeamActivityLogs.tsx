"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Upload,
  Download,
  UserPlus,
  UserMinus,
  Trash2,
  Clock,
  Plus,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface ActivityUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo?: string;
  clerkId: string;
}

interface TeamActivityItem {
  _id: string;
  teamId: string;
  userId: ActivityUser;
  action:
    | "created"
    | "joined"
    | "uploaded"
    | "downloaded"
    | "deleted"
    | "left"
    | "invited";
  fileId?: string;
  fileName?: string;
  metadata?: {
    invitedUser?: string;
    invitedUserEmail?: string;
    fileSize?: number;
    fileType?: string;
    teamName?: string;
    fileCount?: number;
  };
  timestamp: string;
}

interface TeamActivityLogsProps {
  teamId: string;
  children?: React.ReactNode;
}

const ActivityIcon = ({ action }: { action: TeamActivityItem["action"] }) => {
  const iconClass = "h-4 w-4";

  switch (action) {
    case "created":
      return <Plus className={`${iconClass} text-blue-600`} />;
    case "joined":
      return <UserPlus className={`${iconClass} text-green-500`} />;
    case "uploaded":
      return <Upload className={`${iconClass} text-blue-500`} />;
    case "downloaded":
      return <Download className={`${iconClass} text-purple-500`} />;
    case "deleted":
      return <Trash2 className={`${iconClass} text-red-500`} />;
    case "left":
      return <UserMinus className={`${iconClass} text-orange-500`} />;
    case "invited":
      return <UserPlus className={`${iconClass} text-cyan-500`} />;
    default:
      return <Activity className={`${iconClass} text-muted-foreground`} />;
  }
};

const ActivityBadge = ({ action }: { action: TeamActivityItem["action"] }) => {
  const badgeVariants: Record<TeamActivityItem["action"], string> = {
    created: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    joined: "bg-green-100 text-green-800 hover:bg-green-100",
    uploaded: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    downloaded: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    deleted: "bg-red-100 text-red-800 hover:bg-red-100",
    left: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    invited: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  };

  return (
    <Badge variant="secondary" className={badgeVariants[action]}>
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </Badge>
  );
};

const ActivityDescription = ({ activity }: { activity: TeamActivityItem }) => {
  const userName = `${activity.userId.first_name} ${activity.userId.last_name}`;

  switch (activity.action) {
    case "created":
      return (
        <span>
          <strong>{userName}</strong> created the team{" "}
          {activity.metadata?.teamName && (
            <em>&ldquo;{activity.metadata.teamName}&rdquo;</em>
          )}
        </span>
      );
    case "joined":
      return (
        <span>
          <strong>{userName}</strong> joined the team
        </span>
      );
    case "uploaded":
      if (activity.metadata?.fileCount && activity.metadata.fileCount > 1) {
        return (
          <span>
            <strong>{userName}</strong> uploaded <em>{activity.fileName}</em>{" "}
            (bulk upload)
          </span>
        );
      }
      return (
        <span>
          <strong>{userName}</strong> uploaded <em>{activity.fileName}</em>
        </span>
      );
    case "downloaded":
      if (activity.metadata?.fileCount && activity.metadata.fileCount > 1) {
        return (
          <span>
            <strong>{userName}</strong> downloaded <em>{activity.fileName}</em>{" "}
            (bulk download)
          </span>
        );
      }
      return (
        <span>
          <strong>{userName}</strong> downloaded <em>{activity.fileName}</em>
        </span>
      );
    case "deleted":
      return (
        <span>
          <strong>{userName}</strong> deleted <em>{activity.fileName}</em>
        </span>
      );
    case "left":
      return (
        <span>
          <strong>{userName}</strong> left the team
        </span>
      );
    case "invited":
      return (
        <span>
          <strong>{userName}</strong> invited{" "}
          {activity.metadata?.invitedUser || "someone"} to the team
        </span>
      );
    default:
      return (
        <span>
          <strong>{userName}</strong> performed an action
        </span>
      );
  }
};

export default function TeamActivityLogs({
  teamId,
  children,
}: TeamActivityLogsProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["team-activities", teamId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/team-activities?teamId=${teamId}&clerkId=${user?.id}&page=${pageParam}&limit=20`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch team activities");
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.pagination?.hasNext) {
        return lastPage.data.pagination.currentPage + 1;
      }
      return undefined;
    },
    enabled: open && !!user?.id && !!teamId,
    initialPageParam: 1,
  });

  const allActivities =
    data?.pages?.flatMap((page) => page.data?.activities || []) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Team Activity Logs
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Image src="/loading.gif" alt="Loading" height={40} width={40} />
              <p className="text-sm text-muted-foreground">
                Loading activities...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <Activity className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-medium mb-2">Failed to load activities</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading the team activities.
                </p>
              </div>
            </div>
          ) : !allActivities.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <Activity className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-medium mb-2">No activities yet</h3>
                <p className="text-sm text-muted-foreground">
                  Team activities will appear here as members interact with the
                  team.
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {allActivities.map(
                  (activity: TeamActivityItem, index: number) => (
                    <div key={activity._id}>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={activity.userId.photo} />
                          <AvatarFallback>
                            {activity.userId.first_name?.[0]}
                            {activity.userId.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <ActivityIcon action={activity.action} />
                            <ActivityBadge action={activity.action} />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Clock className="h-3 w-3" />
                              {format(
                                new Date(activity.timestamp),
                                "MMM dd, yyyy 'at' h:mm a"
                              )}
                            </div>
                          </div>

                          <div className="text-sm">
                            <ActivityDescription activity={activity} />
                          </div>

                          {activity.metadata && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {activity.metadata.fileSize && (
                                <div>
                                  Size:{" "}
                                  {(
                                    activity.metadata.fileSize /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </div>
                              )}
                              {activity.metadata.fileType && (
                                <div>Type: {activity.metadata.fileType}</div>
                              )}
                              {activity.metadata.invitedUserEmail && (
                                <div>
                                  Invited: {activity.metadata.invitedUserEmail}
                                </div>
                              )}
                              {activity.metadata.fileCount &&
                                activity.metadata.fileCount > 1 && (
                                  <div>
                                    File count: {activity.metadata.fileCount}
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      {index < allActivities.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  )
                )}

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center py-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="gap-2"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Image
                            src="/loading.gif"
                            alt="Loading"
                            height={16}
                            width={16}
                          />
                          Loading more...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Load More Activities
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
