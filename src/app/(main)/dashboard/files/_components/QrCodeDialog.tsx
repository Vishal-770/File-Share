import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

const QrCodeDialog = ({
  qrCode,
  qrCodeDialog,
  setQrCodeDialog,
}: {
  qrCode: string; // base64 image string (data:image/png;base64,...)
  qrCodeDialog: boolean;
  setQrCodeDialog: (open: boolean) => void;
}) => {
  return (
    <Dialog open={qrCodeDialog} onOpenChange={setQrCodeDialog}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to access the file directly.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Image
            src={qrCode} // base64 string like 'data:image/png;base64,...'
            alt="QR Code"
            width={160}
            height={160}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeDialog;
