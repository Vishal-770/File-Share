import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import User from "@/database/mongodb/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// Categorize file types
const categorizeFileType = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  if (type.includes('image') || 
      type.includes('jpg') || 
      type.includes('jpeg') || 
      type.includes('png') || 
      type.includes('gif') || 
      type.includes('webp') || 
      type.includes('svg')) {
    return 'Images';
  }
  
  if (type.includes('video') || 
      type.includes('mp4') || 
      type.includes('avi') || 
      type.includes('mov') || 
      type.includes('mkv') || 
      type.includes('webm')) {
    return 'Videos';
  }
  
  if (type.includes('audio') || 
      type.includes('mp3') || 
      type.includes('wav') || 
      type.includes('flac') || 
      type.includes('ogg')) {
    return 'Audio';
  }
  
  if (type.includes('pdf') || 
      type.includes('doc') || 
      type.includes('docx') || 
      type.includes('txt') || 
      type.includes('rtf') || 
      type.includes('xls') || 
      type.includes('xlsx') || 
      type.includes('ppt') || 
      type.includes('pptx')) {
    return 'Documents';
  }
  
  if (type.includes('zip') || 
      type.includes('rar') || 
      type.includes('7z') || 
      type.includes('tar') || 
      type.includes('gz')) {
    return 'Archives';
  }
  
  return 'Others';
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("id");
    
    if (!clerkId) {
      return NextResponse.json(
        {
          message: "User ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Fetch user data with populated teams
    const user = await User.findOne({ clerkId }).populate('teams').lean();
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Fetch user's files
    const files = await FileModel.find({ clerkId }).lean();
    
    // Categorize files by type
    const filesByType = new Map<string, { count: number; size: number }>();
    
    files.forEach(file => {
      const category = categorizeFileType(file.fileType);
      const existing = filesByType.get(category) || { count: 0, size: 0 };
      filesByType.set(category, {
        count: existing.count + 1,
        size: existing.size + file.size
      });
    });

    // Convert map to array for response
    const filesByTypeArray = Array.from(filesByType.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      size: data.size,
      color: getColorForType(type)
    }));

    const response = {
      success: true,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        max_storage_size: user.max_storage_size,
        current_storage_size: user.current_storage_size,
        max_file_upload_size: user.max_file_upload_size,
        teams: user.teams,
      },
      fileStats: {
        totalFiles: files.length,
        filesByType: filesByTypeArray,
      },
    };

    return NextResponse.json(response, { status: 200 });
    
  } catch (err: unknown) {
    console.error("Profile API error:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message, success: false },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Helper function to get colors for file types
function getColorForType(type: string): string {
  const colors: Record<string, string> = {
    Documents: "#8884d8",
    Images: "#82ca9d", 
    Videos: "#ffc658",
    Archives: "#ff7c7c",
    Audio: "#8dd1e1",
    Others: "#d084d0"
  };
  return colors[type] || colors.Others;
}