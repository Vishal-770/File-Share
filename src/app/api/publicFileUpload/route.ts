import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode-generator";
import dbConnect from "@/database/mongodb/dbConnect";
import PublicFile from "@/database/mongodb/models/publicfile.model";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { fileUrls } = body;
    const uniqueId = nanoid(10);
    const qr = QRCode(0, "L");
    qr.addData(`${process.env.BASE_URL!}/public/${uniqueId}`);
    qr.make();

    const qrCode = qr.createDataURL();

    if (!Array.isArray(fileUrls)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create and save new document
    await PublicFile.create({ fileUrls, qrCode, uniqueId });

    return NextResponse.json(
      {
        success: true,
        qrCode,
        url: `${process.env.BASE_URL!}/public/${uniqueId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/public-files error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
