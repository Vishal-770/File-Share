import { renderSendFileTemplate } from "@/components/emailtemplates/SendFileTemplate";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderName, shareUrls } = body;
    const recipientsInput = Array.isArray(body.recipientEmails)
      ? body.recipientEmails
      : body.recipientEmail
      ? [body.recipientEmail]
      : [];
    const recipients = Array.from(
      new Set(
        recipientsInput
          .map((email: string) => email?.trim())
          .filter((email: string | undefined) => !!email)
      )
    );

    if (!recipients.length) {
      return Response.json(
        { error: "At least one recipient email is required" },
        { status: 400 }
      );
    }

    if (!shareUrls?.length) {
      return Response.json(
        { error: "No files selected to share" },
        { status: 400 }
      );
    }
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return Response.json(
        { error: "Email credentials are not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const safeSenderName = senderName?.trim() || "A FileDrop user";

    const htmlContent = renderSendFileTemplate({
      senderName: safeSenderName,
      shareUrls,
    });

    const mailOptions = {
      from: `File Drop <${process.env.GMAIL_USER}>`,
      to: recipients,
      subject: `${safeSenderName} sent you file${
        shareUrls.length > 1 ? "s" : ""
      } via FileDrop`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return Response.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
