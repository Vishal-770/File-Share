import dbConnect from "@/database/mongodb/dbConnect";
import FileModel, { IFile } from "@/database/mongodb/models/file.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body: IFile = await req.json();
    const { fileName, fileUrl, fileType, size, clerkId, filePath } = body;
    if (!fileName || !fileUrl || !fileType || !size || !clerkId || !filePath) {
      return NextResponse.json(
        {
          message: "All Fileds Are Required",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    const newFile = new FileModel({
      fileName,
      fileType,
      fileUrl,
      size,
      clerkId,
    });
    await newFile.save();
    return NextResponse.json(
      {
        message: "File Details Saved Successfully",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "An unknown error occurred" });
  }
}
