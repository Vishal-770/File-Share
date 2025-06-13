import dbConnect from "@/database/mongodb/dbConnect";
import FileModel, { IFile } from "@/database/mongodb/models/file.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("id");
    if (!clerkId)
      return NextResponse.json(
        {
          message: "All fields are required",
          success: false,
        },
        { status: 400 }
      );
    const files: IFile[] = await FileModel.find({ clerkId });
    if (files.length === 0)
      return NextResponse.json(
        {
          message: "No Files Found for the user Id",
          success: false,
          files: [],
        },
        { status: 200 }
      );

    return NextResponse.json({ files, success: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error)
      return NextResponse.json(
        { message: err.message, success: false },
        { status: 500 }
      );
  }
}
