import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordChangeDialogProps = {
  passwordFileUrl: string | null;
  setPasswordFileUrl: (url: string | null) => void;
  password: string;
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
  const handleClose = () => {
    setPasswordFileUrl(null);
    setPassword(""); // Clear password when closing
  };

  const handleSubmit = () => {
    if (!passwordFileUrl || !password.trim()) return;
    handleUpdatePassword({
      fileUrl: passwordFileUrl,
      password: password.trim(),
    });
  };

  return (
    <Dialog open={!!passwordFileUrl} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Password</DialogTitle>
          <DialogDescription>
            Enter a password to protect this file.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            type="password"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={passwordMutation.isPending || !password.trim()}
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
