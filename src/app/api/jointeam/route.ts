import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
import { logTeamActivity } from "@/utils/teamActivityLogger";
import { Types } from "mongoose";
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
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { message: "User not found with provided clerkId.", success: false },
        { status: 404 }
      );
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { message: "Team not found with provided teamId.", success: false },
        { status: 404 }
      );
    }
    if (user.teams.includes(team._id as Types.ObjectId)) {
      return NextResponse.json(
        {
          message: "You Already a member/leader of this team.",
          success: false,
        },
        { status: 400 }
      );
    }
    team.teamMembers.push(user._id as (typeof team.teamMembers)[0]);
    await team.save();
    user.teams.push(team._id as (typeof user.teams)[0]);
    await user.save();

    // Log the join activity
    await logTeamActivity({
      teamId,
      clerkId,
      action: "joined",
    });

    return NextResponse.json(
      {
        message: "User added to team successfully.",
        team,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message, success: false },
        { status: 500 }
      );
    }
  }
}
