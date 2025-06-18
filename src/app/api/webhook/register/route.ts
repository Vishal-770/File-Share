import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import User from "@/database/mongodb/models/user.model";
import dbConnect from "@/database/mongodb/dbConnect";

export async function POST(req: NextRequest) {
  const WebHookSecret = process.env.WEBHOOK_SECRET;
  if (!WebHookSecret) {
    console.error("❌ WEBHOOK_SECRET is not defined");
    return new Response("Server misconfiguration", { status: 500 });
  }

  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WebHookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (err) {
      console.error("❌ Webhook verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    const { type: eventType, data } = evt;

    console.log("✅ Webhook Event:", eventType);

    if (eventType === "user.created") {
      try {
        await dbConnect();

        const newUser = await User.create({
          clerkId: data?.id,
          email: data?.email_addresses?.[0]?.email_address || "",
          first_name: data?.first_name,
          last_name: data?.last_name,
          teams: [],
        });

        console.log("✅ User created in DB:", newUser._id);
      } catch (err) {
        console.error("❌ Failed to create user in DB:", err);
        return new Response("DB error", { status: 500 });
      }
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
