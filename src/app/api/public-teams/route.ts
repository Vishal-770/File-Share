import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import { NextRequest, NextResponse } from "next/server";
import "@/database/mongodb/models/user.model";
import "@/database/mongodb/models/file.model";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim().toLowerCase();

    const filter: Record<string, unknown> = { isPublic: true };
    if (q) {
      filter.$or = [
        { teamName: { $regex: q, $options: "i" } },
        { teamDescription: { $regex: q, $options: "i" } },
        { teamId: { $regex: q, $options: "i" } },
      ];
    }

    const teams = await Team.find(filter)
      .limit(100)
      .select(
        "teamName teamDescription teamId isPublic teamLeader teamMembers files"
      )
      .populate("teamLeader")
      .populate("teamMembers");

    return NextResponse.json({ success: true, teams });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
