interface EmailTemplateProps {
  senderName: string;
  shareUrls: string[];
}

const buttonList = (shareUrls: string[]) =>
  shareUrls
    .map(
      (url, index) => `
        <div style="margin-bottom: 12px;">
          <a
            href="${url}"
            style="
              background-color: #3b82f6;
              color: #ffffff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              display: inline-block;
            "
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View File ${index + 1}
          </a>
        </div>
      `
    )
    .join("");

export const renderSendFileTemplate = ({
  senderName,
  shareUrls,
}: EmailTemplateProps) => {
  return `
  <div
    style="
      font-family: 'Segoe UI', sans-serif;
      background-color: #f9fafb;
      padding: 40px 16px;
      color: #111827;
      line-height: 1.6;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 32px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.06);
      "
    >
      <h2 style="font-size: 22px; margin-bottom: 12px;">
        📁 You&#39;ve received ${shareUrls.length} file${
    shareUrls.length > 1 ? "s" : ""
  }!
      </h2>
      <p style="font-size: 16px; margin-bottom: 20px;">
        <strong>${senderName}</strong> has shared the following file${
    shareUrls.length > 1 ? "s" : ""
  } with you using <strong>FileDrop</strong>.
      </p>
      <p style="font-size: 15px; margin-bottom: 20px;">
        Click the links below to view and download each file securely:
      </p>
      <div style="text-align: center; margin-bottom: 32px;">
        ${buttonList(shareUrls)}
      </div>
      <p style="font-size: 13px; color: #6b7280; margin-bottom: 0;">
        If you weren’t expecting this, you can safely ignore the message.
      </p>
      <hr
        style="
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 30px 0;
        "
      />
      <footer
        style="text-align: center; font-size: 12px; color: #9ca3af;"
      >
        Powered by <strong>FileDrop</strong> · Simple, Secure File Sharing
      </footer>
    </div>
  </div>
  `;
};
