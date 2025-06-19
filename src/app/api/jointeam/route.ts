import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
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
    if (user.teams.includes(teamId)) {
      return NextResponse.json(
        { message: "User already a member of this team.", success: false },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { message: "Team not found with provided teamId.", success: false },
        { status: 404 }
      );
    }

    team.teamMembers.push(user._id as (typeof team.teamMembers)[0]);
    await team.save();
    user.teams.push(team._id as (typeof user.teams)[0]);
    await user.save();
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
