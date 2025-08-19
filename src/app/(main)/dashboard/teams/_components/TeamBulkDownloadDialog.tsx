"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, File, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { formatBytes } from "@/utils/functions";
import { toast } from "sonner";

export interface TeamFileLite {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  size?: number; // optional if available
}

interface TeamBulkDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: TeamFileLite[]; // subset of selected team files
  teamName?: string;
}

const TeamBulkDownloadDialog: React.FC<TeamBulkDownloadDialogProps> = ({
  open,
  onOpenChange,
  files,
  teamName,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [downloadAsZip, setDownloadAsZip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedIds(files.map((f) => f.fileId));
      setDownloadAsZip(false);
    }
  }, [open, files]);

  const toggle = (id: string) => {
    if (isDownloading) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const allSelected = selectedIds.length === files.length && files.length > 0;
  const toggleAll = () => {
    if (isDownloading) return;
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(files.map((f) => f.fileId));
  };

  const selectedFiles = files.filter((f) => selectedIds.includes(f.fileId));
  const totalBytes = selectedFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  const performDownload = async () => {
    if (!selectedIds.length || isDownloading) return;
    setIsDownloading(true);
    try {
      if (downloadAsZip) {
        const zip = new JSZip();
        let added = 0;
        for (const f of selectedFiles) {
          try {
            const res = await fetch(f.fileUrl);
            if (!res.ok) throw new Error("Failed to fetch file");
            const blob = await res.blob();
            const baseName = f.fileName || `file-${f.fileId}`;
            const name = zip.file(baseName)
              ? `${Date.now()}-${baseName}`
              : baseName;
            zip.file(name, blob);
            added++;
          } catch (err) {
            console.error("Failed to add to zip", f.fileName, err);
          }
        }
        if (added > 0) {
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${teamName || "team"}-files-${added}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success(`Downloaded zip with ${added} file(s)`);
        } else {
          toast.error("No files were added to the zip");
        }
      } else {
        let success = 0;
        for (const f of selectedFiles) {
          try {
            const res = await fetch(f.fileUrl);
            if (!res.ok) throw new Error("Failed to fetch file");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = f.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            success++;
          } catch (err) {
            console.error("Download failed", f.fileName, err);
          }
        }
        toast.success(`Downloaded ${success} file(s)`);
      }
      onOpenChange(false);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isDownloading && onOpenChange(o)}>
      <DialogContent className="max-w-xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" /> Download Team Files
            </DialogTitle>
            <DialogDescription>
              Select which files to download. Optionally bundle them into a
              single zip archive.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden px-4 py-4 sm:px-6 gap-4">
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleAll}
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                disabled={isDownloading}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-medium">Select All ({files.length})</span>
            </div>
            <span className="text-muted-foreground">
              {selectedIds.length} selected • {formatBytes(totalBytes)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="team-as-zip"
              checked={downloadAsZip}
              onCheckedChange={(v) => !isDownloading && setDownloadAsZip(!!v)}
              disabled={isDownloading}
            />
            <label
              htmlFor="team-as-zip"
              className="select-none cursor-pointer text-muted-foreground"
            >
              Download as single .zip
            </label>
          </div>
          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-2 space-y-2">
              {files.map((file) => {
                const checked = selectedIds.includes(file.fileId);
                return (
                  <div
                    key={file.fileId}
                    onClick={() => toggle(file.fileId)}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                      checked ? "bg-primary/5 border-primary/30" : "bg-muted/40"
                    } ${
                      isDownloading
                        ? "opacity-60 pointer-events-none"
                        : "cursor-pointer hover:bg-muted/60"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(file.fileId)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDownloading}
                    />
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.fileType}
                      </p>
                    </div>
                    {!checked && (
                      <span className="text-xs text-muted-foreground">
                        (skip)
                      </span>
                    )}
                  </div>
                );
              })}
              {files.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6">
                  No files selected.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={performDownload}
              disabled={selectedIds.length === 0 || isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Downloading...
                </>
              ) : downloadAsZip ? (
                `Download Zip (${selectedIds.length})`
              ) : (
                `Download ${selectedIds.length}`
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamBulkDownloadDialog;
