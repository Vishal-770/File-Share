"use client";
import React, { useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FileDetails from "@/types/FileType";
const ShareDialog = ({ file }: { file: FileDetails }) => {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Dialog onOpenChange={() => setCopied(false)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Share2 className="w-4 h-4 mr-1" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy & Share</DialogTitle>
          <DialogDescription className="pb-2">
            Share this link with others
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            value={`${process.env.NEXT_PUBLIC_BASE_URL}/share?fileId=${file.fileId}`}
            readOnly
            className="w-full"
            id={`share-link-${file._id}`}
          />
          <Button
            disabled={copied}
            type="button"
            className="cursor-pointer"
            onClick={() => {
              const url = `${process.env.NEXT_PUBLIC_BASE_URL}/share?fileId=${file.fileId}`;
              navigator.clipboard.writeText(url);
              setCopied(true);
              toast.success("Link copied to clipboard!");
            }}
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
