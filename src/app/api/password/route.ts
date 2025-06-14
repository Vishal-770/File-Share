import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import { PasswordBody } from "@/types/FileType";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body: PasswordBody = await req.json();
    const { password, fileUrl } = body;

    if (!fileUrl || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const fileDetails = await FileModel.findOne({ fileUrl });

    if (!fileDetails) {
      return NextResponse.json(
        { message: "No file found", success: false },
        { status: 404 }
      );
    }

    fileDetails.password = password;
    await fileDetails.save();

    return NextResponse.json(
      { message: "Password updated successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating file password:", err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
