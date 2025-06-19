import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
import Team from "@/database/mongodb/models/team.model";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { teamId, fileId } = body;

    if (!teamId || !fileId) {
      return NextResponse.json(
        { message: "teamId and fileId are required.", success: false },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { message: "Team not found.", success: false },
        { status: 404 }
      );
    }

    const file = await FileModel.findOne({ fileId });
    if (!file) {
      return NextResponse.json(
        { message: "File not found with provided fileId.", success: false },
        { status: 404 }
      );
    }
    type MongoId = Types.ObjectId;
    const fileMongoId: MongoId = file._id as Types.ObjectId;

    if (team.files.includes(fileMongoId)) {
      return NextResponse.json(
        { message: "File already exists in the team.", success: false },
        { status: 400 }
      );
    }

    team.files.push(fileMongoId);
    await team.save();

    return NextResponse.json(
      { message: "File added to team successfully.", success: true },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message, success: false },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred.", success: false },
      { status: 500 }
    );
  }
}
