import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const teamId = url.searchParams.get("id");

    if (!teamId) {
      return NextResponse.json(
        { message: "Missing teamId", success: false },
        { status: 400 }
      );
    }

    const deletedTeam = await Team.findOneAndDelete({ teamId });

    if (!deletedTeam) {
      return NextResponse.json(
        { message: "Team not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Team deleted successfully",
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
