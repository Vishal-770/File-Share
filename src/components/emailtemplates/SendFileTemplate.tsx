import * as React from "react";

interface EmailTemplateProps {
  senderName: string;
  shareUrls: string[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  senderName,
  shareUrls,
}) => {
  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f9fafb",
        padding: "40px 16px",
        color: "#111827",
        lineHeight: "1.6",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "32px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>
          📁 You&#39;ve received {shareUrls.length} file
          {shareUrls.length > 1 ? "s" : ""}!
        </h2>

        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          <strong>{senderName}</strong> has shared the following file
          {shareUrls.length > 1 ? "s" : ""} with you using{" "}
          <strong>FileDrop</strong>.
        </p>

        <p style={{ fontSize: "15px", marginBottom: "20px" }}>
          Click the links below to view and download each file securely:
        </p>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {shareUrls.map((url, index) => (
            <div key={index} style={{ marginBottom: "12px" }}>
              <a
                href={url}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  padding: "10px 20px",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 View File {index + 1}
              </a>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "0" }}>
          If you weren’t expecting this, you can safely ignore the message.
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "30px 0",
          }}
        />

        <footer
          style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af" }}
        >
          Powered by <strong>FileDrop</strong> · Simple, Secure File Sharing
        </footer>
      </div>
    </div>
  );
};
