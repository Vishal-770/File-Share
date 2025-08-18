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
import { File, Trash2, Loader2 } from "lucide-react";
import FileDetails from "@/types/FileType";
import { formatBytes } from "@/utils/functions";

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileDetails[]; // all selected files passed in
  onConfirm: (fileIds: string[]) => void; // triggered with final chosen ids
  isDeleting: boolean;
}

const BulkDeleteDialog: React.FC<BulkDeleteDialogProps> = ({
  open,
  onOpenChange,
  files,
  onConfirm,
  isDeleting,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sync local selection each time dialog opens or file list changes
  useEffect(() => {
    if (open) {
      setSelectedIds(files.map((f) => f._id));
    }
  }, [open, files]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const allSelected = selectedIds.length === files.length && files.length > 0;
  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(files.map((f) => f._id));
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return; // guard
    onConfirm(selectedIds);
  };

  const totalBytes = files
    .filter((f) => selectedIds.includes(f._id))
    .reduce((acc, f) => acc + (f.size || 0), 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !isDeleting && onOpenChange(o)}>
      {/* The DialogContent is already responsive with `w-full` and `max-w-xl` */}
      <DialogContent className="max-w-xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        {/* Header (sticky inside dialog) */}
        {/* Responsive padding: px-4 on mobile, sm:px-6 on larger screens */}
        <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" /> Delete Files
            </DialogTitle>
            <DialogDescription>
              Review the selected files. Deselect any you want to keep. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body scrollable */}
        {/* Responsive padding */}
        <div className="flex-1 flex flex-col overflow-hidden px-4 py-4 sm:px-6 gap-4">
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => !isDeleting && toggleAll()}
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                disabled={isDeleting}
                onClick={(e) => e.stopPropagation()} // Prevent double toggle
              />
              <span className="font-medium">Select All ({files.length})</span>
            </div>
            <span className="text-muted-foreground">
              {selectedIds.length} selected • {formatBytes(totalBytes)}
            </span>
          </div>
          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-2 space-y-2">
              {files.map((file) => {
                const checked = selectedIds.includes(file._id);
                return (
                  <div
                    key={file._id}
                    onClick={() => !isDeleting && toggle(file._id)}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? "bg-destructive/5 border-destructive/30"
                        : "bg-muted/40"
                    } ${
                      isDeleting
                        ? "opacity-60 pointer-events-none"
                        : "cursor-pointer hover:bg-muted/60"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(file._id)}
                      onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent div
                      disabled={isDeleting}
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

        {/* Footer pinned */}
        {/* Responsive padding */}
        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Responsive button layout: stack on mobile, row on larger screens */}
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto" // Responsive width
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={selectedIds.length === 0 || isDeleting}
              className="w-full sm:w-auto" // Responsive width
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.length || ""}`
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteDialog;
