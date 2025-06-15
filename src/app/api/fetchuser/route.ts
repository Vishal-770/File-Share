import User from "@/database/mongodb/models/user.model";
import dbConnect from "@/database/mongodb/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("id");

    if (!clerkId) {
      return NextResponse.json(
        { message: "Missing 'id' query parameter" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
