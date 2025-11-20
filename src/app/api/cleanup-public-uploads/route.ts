import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb/dbConnect";
import PublicFile from "@/database/mongodb/models/publicfile.model";
import { supabase } from "@/database/supabase/supabase";

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const AUTH_TOKEN = process.env.PUBLIC_UPLOAD_CLEANUP_TOKEN;
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CLEANUP_CORS_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  if (!AUTH_TOKEN) {
    console.error("PUBLIC_UPLOAD_CLEANUP_TOKEN is not configured");
    return NextResponse.json(
      { success: false, message: "Cleanup token is not configured" },
      { status: 500, headers: corsHeaders }
    );
  }

  const token = extractBearerToken(req.headers.get("authorization"));
  if (token !== AUTH_TOKEN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    await dbConnect();

    const cutoffDate = new Date(Date.now() - TWELVE_HOURS_MS);
    const expiredFiles = await PublicFile.find({
      createdAt: { $lte: cutoffDate },
    });

    if (!expiredFiles.length) {
      return NextResponse.json(
        {
          success: true,
          message: "No expired public uploads to remove",
          expiredCount: 0,
          storageObjectsRemoved: 0,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    const storageObjects = new Set<string>();
    let skippedUrls = 0;

    expiredFiles.forEach((record) => {
      record.fileUrls.forEach((url) => {
        const path = extractStoragePath(url);
        if (path) {
          storageObjects.add(path);
        } else {
          skippedUrls += 1;
        }
      });
    });

    let storageObjectsRemoved = 0;
    if (storageObjects.size) {
      const { data, error } = await supabase.storage
        .from("uploads")
        .remove(Array.from(storageObjects));

      if (error) {
        console.error("Failed to delete objects from Supabase", error.message);
        return NextResponse.json(
          { success: false, message: "Failed to delete files from storage" },
          { status: 500, headers: corsHeaders }
        );
      }

      storageObjectsRemoved = data?.length ?? 0;
    }

    const deletedResult = await PublicFile.deleteMany({
      _id: { $in: expiredFiles.map((record) => record._id) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expired public uploads removed",
        expiredCount: expiredFiles.length,
        storageObjectsRemoved,
        skippedUrls,
        deletedRecords: deletedResult.deletedCount,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/cleanup-public-uploads error", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

function extractBearerToken(headerValue: string | null): string | null {
  if (!headerValue) return null;
  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

function extractStoragePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/uploads/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    const encodedPath = parsed.pathname.slice(index + marker.length);
    return decodeURIComponent(encodedPath);
  } catch (error) {
    console.warn("Failed to parse storage path for", url, error);
    return null;
  }
}
