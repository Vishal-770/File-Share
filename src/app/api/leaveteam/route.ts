import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
import { logTeamActivity } from "@/utils/teamActivityLogger";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamId, clerkId } = body;

    if (!teamId || !clerkId) {
      return NextResponse.json(
        { message: "teamId and clerkId are required.", success: false },
        { status: 400 }
      );
    }

    await dbConnect();

    // Step 1: Get user with clerkId
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { message: "User not found with provided clerkId.", success: false },
        { status: 404 }
      );
    }

    // Step 2: Get team with teamId
    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { message: "Team not found with provided teamId.", success: false },
        { status: 404 }
      );
    }

    // Step 3: Ensure user._id is in team.teamMembers using $in
    const isUserInTeam = await Team.findOne({
      teamId,
      teamMembers: { $in: [user._id] },
    });

    if (!isUserInTeam) {
      return NextResponse.json(
        { message: "User is not a member of this team.", success: false },
        { status: 400 }
      );
    }

    // Step 4: Pull user from team and team from user using MongoDB only
    await Team.updateOne({ teamId }, { $pull: { teamMembers: user._id } });

    await User.updateOne({ clerkId }, { $pull: { teams: team._id } });

    // Log the leave activity
    await logTeamActivity({
      teamId,
      clerkId,
      action: "left",
    });

    return NextResponse.json(
      {
        message: "User successfully removed from team.",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error leaving team:", err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
