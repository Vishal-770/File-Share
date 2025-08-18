import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import User from "@/database/mongodb/models/user.model";
import { supabase } from "@/database/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid 'ids' array in request body.", success: false },
        { status: 400 }
      );
    }

    // Find all files to be deleted
    const filesToDelete = await FileModel.find({ _id: { $in: ids } });

    if (filesToDelete.length === 0) {
      return NextResponse.json(
        { message: "No files found for the provided IDs.", success: false },
        { status: 404 }
      );
    }

    // Group files by clerkId for storage size updates
    const storageUpdates: { [clerkId: string]: number } = {};
    const filePaths: string[] = [];

    filesToDelete.forEach((file) => {
      if (!storageUpdates[file.clerkId]) {
        storageUpdates[file.clerkId] = 0;
      }
      storageUpdates[file.clerkId] += file.size;
      filePaths.push(file.filePath);
    });

    // Delete files from database
    const deleteResult = await FileModel.deleteMany({ _id: { $in: ids } });

    // Update user storage sizes
    for (const [clerkId, sizeToSubtract] of Object.entries(storageUpdates)) {
      const userDetails = await User.findOne({ clerkId });
      if (userDetails && typeof userDetails.current_storage_size === "number") {
        userDetails.current_storage_size -= sizeToSubtract;
        await userDetails.save();
      }
    }

    // Delete files from Supabase storage
    if (filePaths.length > 0) {
      console.log("Deleting files from Supabase:", filePaths);
      const { data, error } = await supabase.storage
        .from("uploads")
        .remove(filePaths);

      if (error) {
        console.error("Supabase bulk delete failed:", error.message);
        return NextResponse.json(
          { message: "Failed to delete some files from storage.", success: false },
          { status: 500 }
        );
      }

      console.log("Files deleted from Supabase:", data);
    }

    return NextResponse.json(
      { 
        message: `${deleteResult.deletedCount} file(s) deleted successfully.`, 
        success: true,
        deletedCount: deleteResult.deletedCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/deletefiles error:", error);

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