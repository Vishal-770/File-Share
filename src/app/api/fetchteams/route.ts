import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import { NextRequest, NextResponse } from "next/server";
import "@/database/mongodb/models/file.model";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { teamIds }: { teamIds: string[] } = await req.json();

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Team IDs are required and must be a non-empty array.",
        },
        { status: 400 }
      );
    }

    const teams = await Team.find({ _id: { $in: teamIds } });

    const populatedTeams = await Promise.all(
      teams.map(async (team) => {
        const populated = team.toObject();

        if (team.teamLeader) {
          populated.teamLeader = await team
            .populate("teamLeader")
            .then((t) => t.teamLeader);
        }

        if (team.teamMembers && team.teamMembers.length > 0) {
          populated.teamMembers = await team
            .populate("teamMembers")
            .then((t) => t.teamMembers);
        }

        if (team.files && team.files.length > 0) {
          populated.files = await team.populate("files").then((t) => t.files);
        }

        return populated;
      })
    );

    return NextResponse.json(
      { success: true, data: populatedTeams },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to fetch teams:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
