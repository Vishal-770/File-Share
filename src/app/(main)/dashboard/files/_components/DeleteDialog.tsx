import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

const DeleteDialog = ({
  selectedFileUrl,
  setSelectedFileUrl,
  handleDelete,
  deleteMutation,
}: {
  selectedFileUrl: string|null;
  setSelectedFileUrl: (url: string | null) => void;
  handleDelete: () => void;
  deleteMutation: { isPending: boolean };
}) => {
  return (
    <Dialog
      open={!!selectedFileUrl}
      onOpenChange={() => setSelectedFileUrl(null)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setSelectedFileUrl(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
