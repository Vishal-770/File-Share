import { EmailTemplate } from "@/components/emailtemplates/SendFileTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { recipientEmail, senderName, shareUrls } = await req.json(); // updated: shareUrls

    const { data, error } = await resend.emails.send({
      from: "File Drop <filedrop@resend.dev>",
      to: [recipientEmail],
      subject: `${senderName} sent you file${shareUrls.length > 1 ? "s" : ""} via FileDrop`,
      react: await EmailTemplate({ senderName, shareUrls }), // updated to pass array
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
