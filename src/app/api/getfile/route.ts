import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const fileUrl = url.searchParams.get("fileUrl");

    if (!fileUrl) {
      return NextResponse.json(
        { message: "File Url required", success: false },
        { status: 400 }
      );
    }

    const file = await FileModel.findOne({ fileUrl }).lean();
    if (!file) {
      return NextResponse.json(
        { message: "No file Found for the given Url", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ file, success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message, success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred", success: false },
      { status: 500 }
    );
  }
}
