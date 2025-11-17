import { renderSendFileTemplate } from "@/components/emailtemplates/SendFileTemplate";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { recipientEmail, senderName, shareUrls } = await req.json(); // updated: shareUrls
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

    const htmlContent = renderSendFileTemplate({ senderName, shareUrls });

    const mailOptions = {
      from: `File Drop <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `${senderName} sent you file${
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
