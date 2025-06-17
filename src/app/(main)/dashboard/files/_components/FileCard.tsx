import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download, Eye, Lock, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import ShareDialog from "./ShareDialog";
import { handleDownload } from "@/utils/functions";
import FileDetails from "@/types/FileType";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const FileCard = ({
  file,
  setPasswordFileUrl,
  getFileIcon,
  setRenameFileId,
  setNewFileName,
  setSelectedFileUrl,
  setPassword,
}: {
  file: FileDetails;
  getFileIcon: (fileType: string) => React.ReactNode;
  setPasswordFileUrl: (url: string) => void;
  setRenameFileId: (id: string) => void;
  setNewFileName: (name: string) => void;
  setSelectedFileUrl: (url: string) => void;
  setPassword: (password: string) => void;
}) => {
  return (
    <Card key={file._id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getFileIcon(file.fileType)}
            <CardTitle className="text-sm font-medium line-clamp-1">
              {file.fileName}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleDownload(file.fileUrl, file.fileName)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRenameFileId(file._id);
                  setNewFileName(file.fileName);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setPassword("");
                  setPasswordFileUrl(file.fileUrl);
                }}
              >
                <Lock className="w-4 h-4 mr-2" />
                {file.password ? "Change Password" : "Set Password"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => setSelectedFileUrl(file._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs">
          Uploaded {format(new Date(file.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{(file.size / 1024).toFixed(2)} KB</span>
          <div className="flex items-center gap-2">
            <span className="capitalize">
              {file.fileType.split("/")[1] || file.fileType}
            </span>
            {file.password && (
              <Badge variant="outline" className="h-5">
                Protected
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <ShareDialog file={file} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(file.fileUrl, file.fileName)}
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
