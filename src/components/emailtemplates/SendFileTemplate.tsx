interface EmailTemplateProps {
  senderName: string;
  shareUrls: string[];
}

const formatFileName = (url: string, index: number) => {
  try {
    const parsed = new URL(url);
    const lastSegment = parsed.pathname.split("/").pop() ?? "Shared File";
    return decodeURIComponent(lastSegment) || `Shared File ${index + 1}`;
  } catch {
    const fallback = url.split("/").pop() ?? `Shared File ${index + 1}`;
    return decodeURIComponent(fallback);
  }
};

const buildFileRows = (shareUrls: string[]) =>
  shareUrls
    .map((url, index) => {
      const fileName = formatFileName(url, index);
      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #e5e9f0;">
            <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${fileName}</div>
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid #e5e9f0; text-align: right;">
            <a
              href="${url}"
              style="
                background-color: #0ea5e9;
                color: #ffffff;
                padding: 8px 18px;
                text-decoration: none;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 600;
                display: inline-block;
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </a>
          </td>
        </tr>
      `;
    })
    .join("");

export const renderSendFileTemplate = ({
  senderName,
  shareUrls,
}: EmailTemplateProps) => {
  const fileCount = shareUrls.length;
  const timestamp = new Date().toUTCString();

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f6f7fb; padding:30px 0; font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; color:#111827;">
      <tr>
        <td>
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin:0 auto; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 18px 45px rgba(15,23,42,0.08);">
            <tr>
              <td style="background-color:#1f2a37; padding:28px 36px; color:#ffffff;">
                <p style="margin:0; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; opacity:0.7;">FileDrop Transfer</p>
                <h1 style="margin:10px 0 0; font-size:26px; font-weight:600;">${senderName} shared ${fileCount} file${
    fileCount > 1 ? "s" : ""
  } with you</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 36px; color:#1f2937;">
                <p style="margin:0 0 14px;font-size:15px;">Hello,</p>
                <p style="margin:0 0 28px;font-size:15px; line-height:1.65; color:#475467;">
                  <strong>${senderName}</strong> used FileDrop to securely send you these files. Each button opens the respective file in your browser.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding-bottom:18px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#98a2b3;">
                        <span>Transfer summary</span>
                        <span>${timestamp}</span>
                      </div>
                    </td>
                  </tr>
                  ${buildFileRows(shareUrls)}
                </table>
                <div style="margin:32px 0; text-align:center;">
                  <a
                    href="${shareUrls[0]}"
                    style="
                      background-color:#0f172a;
                      color:#ffffff;
                      padding:12px 30px;
                      border-radius:8px;
                      text-decoration:none;
                      font-weight:600;
                      display:inline-block;
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Files
                  </a>
                </div>
                <div style="padding:18px; border:1px solid #e4e7ec; border-radius:12px; background-color:#f9fafb; font-size:13px; color:#4b5563;">
                  <strong style="color:#111827;">Reminder:</strong> If you weren’t expecting this message you can safely ignore it.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 36px; background-color:#f4f6fb; text-align:center;">
                <p style="margin:0; font-size:12px; color:#98a2b3;">
                  Powered by <strong style="color:#475467;">FileDrop</strong>
                </p>
                <p style="margin:6px 0 0; font-size:12px; color:#c0c6d4;">
                  © ${new Date().getFullYear()} FileDrop
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};
