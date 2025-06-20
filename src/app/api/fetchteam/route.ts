import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const teamId = url.searchParams.get("teamId");
    if (!teamId) {
      return NextResponse.json(
        { message: "teamId is required.", success: false },
        { status: 400 }
      );
    }
    await dbConnect();
    const team = await Team.findOne({ teamId })
      .populate("teamLeader")
      .populate("teamMembers")
      .populate("files");
    if (!team) {
      return NextResponse.json(
        { message: "Team not found with provided teamId.", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Team fetched successfully.",
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
