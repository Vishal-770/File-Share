import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const teamId = url.searchParams.get("id");

    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
      return NextResponse.json(
        { message: "Invalid or missing team ID", success: false },
        { status: 400 }
      );
    }

    // Delete the team and get its _id
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return NextResponse.json(
        { message: "Team not found", success: false },
        { status: 404 }
      );
    }

    await User.updateMany(
      { teams: deletedTeam._id },
      { $pull: { teams: deletedTeam._id } }
    );

    return NextResponse.json(
      {
        message: "Team deleted and removed from all users",
        success: true,
        data: deletedTeam,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /team error:", err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
