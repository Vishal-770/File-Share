import { NextRequest, NextResponse } from "next/server";
import { logTeamActivity } from "@/utils/teamActivityLogger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, clerkId, fileId, fileName, fileType, fileSize, fileCount } =
      body;

    if (!teamId || !clerkId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle bulk download logging
    if (fileCount && fileCount > 1) {
      await logTeamActivity({
        teamId,
        clerkId,
        action: "downloaded",
        fileName: `${fileCount} files`,
        metadata: {
          fileCount,
        },
      });
    } else if (fileId && fileName) {
      // Handle single file download logging
      await logTeamActivity({
        teamId,
        clerkId,
        action: "downloaded",
        fileId,
        fileName,
        metadata: {
          fileType,
          fileSize,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request: either provide fileCount or fileId/fileName",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Download logged successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging download activity:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
