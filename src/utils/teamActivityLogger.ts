import dbConnect from "@/database/mongodb/dbConnect";
import TeamActivity from "@/database/mongodb/models/teamactivity.model";
import User from "@/database/mongodb/models/user.model";

export interface LogActivityParams {
  teamId: string;
  clerkId: string;
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
    fileCount?: number; // For bulk operations
  };
}

export async function logTeamActivity(params: LogActivityParams) {
  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: params.clerkId });
    if (!user) {
      console.error("User not found for activity logging:", params.clerkId);
      return;
    }

    const activity = new TeamActivity({
      teamId: params.teamId,
      userId: user._id,
      action: params.action,
      fileId: params.fileId,
      fileName: params.fileName,
      metadata: params.metadata,
      timestamp: new Date(),
    });

    await activity.save();
    console.log(
      `Team activity logged: ${params.action} by ${params.clerkId} in team ${params.teamId}`
    );
  } catch (error) {
    console.error("Error logging team activity:", error);
    // Don't throw error to avoid breaking main functionality
  }
}
