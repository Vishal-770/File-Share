import dbConnect from "@/database/mongodb/dbConnect";
import FileModel, { IFile } from "@/database/mongodb/models/file.model";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import User from "@/database/mongodb/models/user.model";

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
    const fileId = nanoid(10);
    const newFile = new FileModel({
      fileName,
      fileType,
      fileUrl,
      size,
      clerkId,
      filePath,
      fileId,
    });
    await newFile.save();
    const UserDetails = await User.findOne({ clerkId });
    if (UserDetails && typeof UserDetails.current_storage_size === "number") {
      UserDetails.current_storage_size += size;
      await UserDetails.save();
    }
    
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
