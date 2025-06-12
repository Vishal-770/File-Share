// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const blob = await put(file.name, file, {
    access: "public", // or 'private'
  });

  return Response.json(blob); // blob.url will be the CDN URL
}
