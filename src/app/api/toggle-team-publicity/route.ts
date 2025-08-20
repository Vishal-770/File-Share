import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { teamId, clerkId, isPublic } = await req.json();
    if (!teamId || typeof isPublic !== "boolean" || !clerkId) {
      return NextResponse.json(
        { success: false, message: "teamId, clerkId & isPublic required" },
        { status: 400 }
      );
    }
    await dbConnect();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const team = await Team.findOne({ teamId }).populate("teamLeader");
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }
    if (String(team.teamLeader._id) !== String(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only the team leader can toggle publicity",
        },
        { status: 403 }
      );
    }
    team.isPublic = isPublic;
    await team.save();
    return NextResponse.json({ success: true, team });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
