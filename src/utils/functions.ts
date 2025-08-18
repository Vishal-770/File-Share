import { toast } from "sonner";
export const handleDownload = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("File download failed");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    toast.error("Download failed", {
      description: (err as Error).message,
    });
  }
};

export function extractCleanFileName(url: string): string {
  try {
    const fileName = url.split("/").pop() || "";
    // Remove leading digits and hyphen
    return decodeURIComponent(fileName.replace(/^\d+-/, ""));
  } catch {
    return "";
  }
}
export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};
