import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

const RenameDialog = ({
  renameFileId,
  setRenameFileId,
  newFileName,
  setNewFileName,
  handleRename,
  renameMutation,
}: {
  renameFileId: string | null;
  setRenameFileId: (id: string | null) => void;
  newFileName: string;
  setNewFileName: (name: string) => void;
  handleRename: () => void;
  renameMutation: { isPending: boolean };
}) => {
  return (
    <Dialog open={!!renameFileId} onOpenChange={() => setRenameFileId(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>
            Enter the new name for the file.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter new file name"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRenameFileId(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleRename}
              disabled={renameMutation.isPending || !newFileName.trim()}
            >
              {renameMutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
