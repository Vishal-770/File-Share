import React from "react";
import { DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type PasswordChangeDialogProps = {
  passwordFileUrl: string | null;
  setPasswordFileUrl: (url: string | null) => void;
  password: string | null;
  setPassword: (password: string) => void;
  handleUpdatePassword: (params: { fileUrl: string; password: string }) => void;
  passwordMutation: { isPending: boolean };
};

const PasswordChangeDialog = ({
  passwordFileUrl,
  setPasswordFileUrl,
  password,
  setPassword,
  handleUpdatePassword,
  passwordMutation,
}: PasswordChangeDialogProps) => {
  return (
    <Dialog
      open={!!passwordFileUrl}
      onOpenChange={() => setPasswordFileUrl(null)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Password</DialogTitle>
          <DialogDescription>Enter password for this file</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Input
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            type="password"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPasswordFileUrl(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() =>
                handleUpdatePassword({
                  fileUrl: passwordFileUrl!,
                  password: password!,
                })
              }
              disabled={passwordMutation.isPending || !password?.trim()}
            >
              {passwordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeDialog;
