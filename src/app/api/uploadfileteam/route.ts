import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import Team from "@/database/mongodb/models/team.model";
import { logTeamActivity } from "@/utils/teamActivityLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { teamId, fileIds, clerkId } = body;

    if (
      !teamId ||
      !Array.isArray(fileIds) ||
      fileIds.length === 0 ||
      !clerkId
    ) {
      return NextResponse.json(
        {
          message: "teamId, fileIds, and clerkId are required.",
          success: false,
        },
        { status: 400 }
      );
    }
    const files = await FileModel.find({ fileId: { $in: fileIds } });

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No matching files found.", success: false },
        { status: 404 }
      );
    }
    const fileObjectIds = files.map((file) => file._id);
    const result = await Team.updateOne(
      { teamId },
      {
        $addToSet: {
          files: { $each: fileObjectIds },
        },
      }
    );

    // Log bulk upload activity
    if (files.length > 1) {
      // Log bulk upload as one activity
      await logTeamActivity({
        teamId,
        clerkId,
        action: "uploaded",
        fileName: `${files.length} files`,
        metadata: {
          fileCount: files.length,
        },
      });
    } else {
      // Log single file upload
      const file = files[0];
      await logTeamActivity({
        teamId,
        clerkId,
        action: "uploaded",
        fileId: file.fileId,
        fileName: file.fileName,
        metadata: {
          fileSize: file.size,
          fileType: file.fileType,
        },
      });
    }

    return NextResponse.json(
      {
        message: `${fileObjectIds.length} file(s) processed.`,
        modifiedCount: result.modifiedCount,
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

    return NextResponse.json(
      { message: "An unknown error occurred.", success: false },
      { status: 500 }
    );
  }
}
