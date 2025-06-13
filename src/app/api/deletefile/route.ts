import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import { supabase } from "@/database/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing 'id' query parameter.", success: false },
        { status: 400 }
      );
    }

    const deletedFile = await FileModel.findOneAndDelete({ _id: id });

    if (!deletedFile) {
      return NextResponse.json(
        { message: "No file found for the provided ID.", success: false },
        { status: 404 }
      );
    }

    const filePath = deletedFile.filePath;
    console.log("Deleting file from Supabase:", filePath);

    const { data, error } = await supabase.storage
      .from("uploads")
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete failed:", error.message);
      return NextResponse.json(
        { message: "Failed to delete from Supabase.", success: false },
        { status: 500 }
      );
    }

    console.log("File deleted from Supabase:", data);
    return NextResponse.json(
      { message: "File deleted successfully.", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/file error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error.",
        success: false,
      },
      { status: 500 }
    );
  }
}
