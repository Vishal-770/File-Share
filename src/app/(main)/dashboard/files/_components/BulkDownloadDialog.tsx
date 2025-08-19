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
import FileDetails from "@/types/FileType";
import { formatBytes } from "@/utils/functions";

interface BulkDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileDetails[]; // selected files passed in
  isDownloading: boolean;
  onConfirm: (fileIds: string[], asZip: boolean) => Promise<void> | void; // triggered with final chosen ids & mode
}

const BulkDownloadDialog: React.FC<BulkDownloadDialogProps> = ({
  open,
  onOpenChange,
  files,
  isDownloading,
  onConfirm,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [downloadAsZip, setDownloadAsZip] = useState<boolean>(false);

  // Sync local selection each time dialog opens or file list changes
  useEffect(() => {
    if (open) {
      setSelectedIds(files.map((f) => f._id));
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
    else setSelectedIds(files.map((f) => f._id));
  };

  const handleDownloadConfirm = async () => {
    if (selectedIds.length === 0 || isDownloading) return;
    await onConfirm(selectedIds, downloadAsZip);
  };

  const selectedFiles = files.filter((f) => selectedIds.includes(f._id));
  const totalBytes = selectedFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !isDownloading && onOpenChange(o)}>
      <DialogContent className="max-w-xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" /> Download Files
            </DialogTitle>
            <DialogDescription>
              Review and deselect files you don&apos;t want. You can also bundle
              them into a single zip archive.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col overflow-hidden px-4 py-4 sm:px-6 gap-4">
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleAll()}
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                disabled={isDownloading}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-medium">Select All ({files.length})</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {selectedIds.length} selected • {formatBytes(totalBytes)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="as-zip"
              checked={downloadAsZip}
              onCheckedChange={(v) => !isDownloading && setDownloadAsZip(!!v)}
              disabled={isDownloading}
            />
            <label
              htmlFor="as-zip"
              className="select-none cursor-pointer text-muted-foreground"
            >
              Download as single .zip
            </label>
          </div>
          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-2 space-y-2">
              {files.map((file) => {
                const checked = selectedIds.includes(file._id);
                return (
                  <div
                    key={file._id}
                    onClick={() => toggle(file._id)}
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
                      onCheckedChange={() => toggle(file._id)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDownloading}
                    />
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.fileType} • {formatBytes(file.size || 0)}
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

        {/* Footer */}
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
              onClick={handleDownloadConfirm}
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
                `Download ${selectedIds.length || ""}`
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDownloadDialog;
