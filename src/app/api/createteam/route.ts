import dbConnect from "@/database/mongodb/dbConnect";
import Team from "@/database/mongodb/models/team.model";
import User from "@/database/mongodb/models/user.model";
import { CreateTeam } from "@/services/service";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    interface CreateTeamBody extends CreateTeam {
      isPublic?: boolean;
    }
    const body: CreateTeamBody = await req.json();
    const { teamName, teamDescription, clerkId, isPublic } = body;

    if (!teamName || !teamDescription || !clerkId) {
      return NextResponse.json(
        {
          message: "teamName, teamDescription, and clerkId are required.",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found with provided clerkId.",
          success: false,
        },
        { status: 404 }
      );
    }

    const teamId = nanoid(6);

    const newTeam = await Team.create({
      teamId,
      teamName,
      teamDescription,
      isPublic: typeof isPublic === "boolean" ? isPublic : false,
      teamLeader: user._id,
      teamMembers: [],
      files: [],
    });
    if (newTeam && newTeam._id && user) {
      user.teams.push(newTeam._id as (typeof user.teams)[0]);
      await user.save();
    }
    return NextResponse.json(
      {
        message: "Team created successfully.",
        team: newTeam,
        success: true,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[TEAM CREATE ERROR]:", err);

    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Something went wrong.",
        success: false,
      },
      { status: 500 }
    );
  }
}
