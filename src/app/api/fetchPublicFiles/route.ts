import dbConnect from "@/database/mongodb/dbConnect";
import PublicFile from "@/database/mongodb/models/publicfile.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uniqueId = searchParams.get("uniqueId");

    if (!uniqueId) {
      return NextResponse.json(
        { error: "Missing uniqueId in query parameters" },
        { status: 400 }
      );
    }

    await dbConnect();
    const publicFile = await PublicFile.findOne({ uniqueId });

    if (!publicFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ data: publicFile }, { status: 200 });
  } catch (err) {
    console.error("Error fetching public file:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
