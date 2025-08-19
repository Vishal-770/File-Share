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
import { Trash2, File, Loader2 } from "lucide-react";

export interface TeamFileLiteDelete {
  fileId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
}

interface TeamBulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: TeamFileLiteDelete[]; // deletable (permission) files only
  isDeleting: boolean;
  onConfirm: (fileIds: string[]) => Promise<void> | void;
  blockedCount: number; // number of selected files user cannot delete
}

const TeamBulkDeleteDialog: React.FC<TeamBulkDeleteDialogProps> = ({
  open,
  onOpenChange,
  files,
  isDeleting,
  onConfirm,
  blockedCount,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedIds(files.map((f) => f.fileId));
    }
  }, [open, files]);

  const toggle = (id: string) => {
    if (isDeleting) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const allSelected = selectedIds.length === files.length && files.length > 0;
  const toggleAll = () => {
    if (isDeleting) return;
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(files.map((f) => f.fileId));
  };

  const handleDelete = async () => {
    if (!selectedIds.length || isDeleting) return;
    await onConfirm(selectedIds);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isDeleting && onOpenChange(o)}>
      <DialogContent className="max-w-xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" /> Delete Team Files
            </DialogTitle>
            <DialogDescription>
              Review and deselect any files you prefer to keep. This action
              cannot be undone.
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
                disabled={isDeleting}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-medium">Select All ({files.length})</span>
            </div>
            <span className="text-muted-foreground">
              {selectedIds.length} selected
              {blockedCount > 0 && (
                <span className="ml-2 text-xs text-amber-600 dark:text-amber-500">
                  {blockedCount} without permission
                </span>
              )}
            </span>
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
                      onCheckedChange={() => toggle(file.fileId)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDeleting}
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
                  No deletable files selected.
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
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={selectedIds.length === 0 || isDeleting}
              className="w-full sm:w-auto"
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

export default TeamBulkDeleteDialog;
