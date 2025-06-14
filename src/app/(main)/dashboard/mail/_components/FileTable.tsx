"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

type FileData = {
  fileName: string;
  fileType: string;
  size: number;
  fileUrl: string;
};

export default function FileTable({
  files,
  setSelectedUrls,
  selectedUrls,
}: {
  files: FileData[];
  selectedUrls: string[];
  setSelectedUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const toggleSelectAll = () => {
    const allUrls = files.map((file) => file.fileUrl);
    const allSelected = allUrls.every((url) => selectedUrls.includes(url));
    setSelectedUrls(allSelected ? [] : allUrls);
  };

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  files.length > 0 && selectedUrls.length === files.length
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead>File Size (KB)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.fileUrl}>
              <TableCell>
                <Checkbox
                  checked={selectedUrls.includes(file.fileUrl)}
                  onCheckedChange={() => toggleSelect(file.fileUrl)}
                />
              </TableCell>
              <TableCell>{file.fileName}</TableCell>
              <TableCell>{file.fileType}</TableCell>
              <TableCell>{(file.size / 1024).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
