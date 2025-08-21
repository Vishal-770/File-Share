import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import Team from "@/database/mongodb/models/team.model";
import { logTeamActivity } from "@/utils/teamActivityLogger";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const fileId = searchParams.get("fileId");
    const clerkId = searchParams.get("clerkId");

    if (!teamId || !fileId || !clerkId) {
      return NextResponse.json(
        {
          message: "teamId, fileId, and clerkId are required.",
          success: false,
        },
        { status: 400 }
      );
    }

    // Find the file to get its ObjectId
    const file = await FileModel.findOne({ fileId });

    if (!file) {
      return NextResponse.json(
        { message: "File not found with the provided fileId.", success: false },
        { status: 404 }
      );
    }

    // Remove the file reference from the team's teamFiles array
    const updatedTeam = await Team.findOneAndUpdate(
      { teamId },
      { $pull: { files: file._id } }
    );

    if (!updatedTeam) {
      return NextResponse.json(
        { message: "Team not found with the provided teamId.", success: false },
        { status: 404 }
      );
    }

    // Log the delete activity
    await logTeamActivity({
      teamId,
      clerkId,
      action: "deleted",
      fileId: file.fileId,
      fileName: file.fileName,
      metadata: {
        fileSize: file.size,
        fileType: file.fileType,
      },
    });

    return NextResponse.json(
      { message: "File removed from team successfully.", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error removing file from team:", err);
    return NextResponse.json(
      { message: "Internal server error.", success: false },
      { status: 500 }
    );
  }
}
