
import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { _id, fileName } = body;

    if (!_id || !fileName) {
      return NextResponse.json(
        { message: "Missing required fields: _id or fileName", success: false },
        { status: 400 }
      );
    }

    const file = await FileModel.findById(_id);

    if (!file) {
      return NextResponse.json(
        { message: "No file found with the provided ID", success: false },
        { status: 404 }
      );
    }

    file.fileName = fileName;
    await file.save();

    return NextResponse.json(
      { message: "File name updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/file error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
