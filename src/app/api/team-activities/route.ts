import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb/dbConnect";
import TeamActivity from "@/database/mongodb/models/teamactivity.model";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";

interface PopulatedUser {
  _id: string;
  clerkId: string;
  first_name: string;
  last_name: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const clerkId = searchParams.get("clerkId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!teamId || !clerkId) {
      return NextResponse.json(
        { success: false, message: "Team ID and Clerk ID are required" },
        { status: 400 }
      );
    }

    // Verify user has access to this team
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const team = await Team.findOne({ teamId }).populate([
      {
        path: "teamLeader",
        select: "clerkId first_name last_name",
      },
      {
        path: "teamMembers",
        select: "clerkId first_name last_name",
      },
    ]);

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is team leader or member
    const isTeamLeader =
      (team.teamLeader as unknown as PopulatedUser).clerkId === clerkId;
    const isTeamMember = (team.teamMembers as unknown as PopulatedUser[]).some(
      (member: PopulatedUser) => member.clerkId === clerkId
    );

    if (!isTeamLeader && !isTeamMember) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    // Fetch activity logs with pagination
    const skip = (page - 1) * limit;

    const activities = await TeamActivity.find({ teamId })
      .populate({
        path: "userId",
        select: "first_name last_name email photo clerkId",
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await TeamActivity.countDocuments({ teamId });
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching team activities:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
