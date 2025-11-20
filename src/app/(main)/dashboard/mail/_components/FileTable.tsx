"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn, formatFileSize, formatRelativeTime } from "@/lib/utils";
import { Search } from "lucide-react";

type FileData = {
  fileName: string;
  fileType: string;
  size: number;
  fileUrl: string;
  createdAt?: string;
};

interface FileTableProps {
  files: FileData[];
  selectedUrls: string[];
  setSelectedUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FileTable({
  files,
  selectedUrls,
  setSelectedUrls,
}: FileTableProps) {
  const [query, setQuery] = React.useState("");

  const filteredFiles = React.useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return files;
    return files.filter((file) => {
      const haystack = `${file.fileName} ${file.fileType}`.toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [files, query]);

  const selectedSize = React.useMemo(() => {
    return files.reduce((total, file) => {
      return selectedUrls.includes(file.fileUrl) ? total + file.size : total;
    }, 0);
  }, [files, selectedUrls]);

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const toggleFilteredSelection = () => {
    const filteredUrls = filteredFiles.map((file) => file.fileUrl);
    const allFilteredSelected = filteredUrls.every((url) =>
      selectedUrls.includes(url)
    );

    setSelectedUrls((prev) => {
      if (allFilteredSelected) {
        return prev.filter((url) => !filteredUrls.includes(url));
      }
      const merged = new Set([...prev, ...filteredUrls]);
      return Array.from(merged);
    });
  };

  const clearSelection = () => setSelectedUrls([]);

  const allFilesSelected =
    files.length > 0 && selectedUrls.length === files.length;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by file name or type"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
          <span>
            {filteredFiles.length} result{filteredFiles.length === 1 ? "" : "s"}
          </span>
          <span>
            {selectedUrls.length} selected · {formatFileSize(selectedSize)}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleFilteredSelection}
              disabled={!filteredFiles.length}
            >
              {filteredFiles.every((file) =>
                selectedUrls.includes(file.fileUrl)
              )
                ? "Unselect filtered"
                : "Select filtered"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={!selectedUrls.length}
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[55vh] rounded-2xl border bg-card/70 shadow-inner p-4">
        {files.length === 0 ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>No files uploaded yet.</p>
            <p className="text-xs">Upload files first from the Files tab.</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
            No files match “{query}”.
          </div>
        ) : (
          <div className="divide-y">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-foreground",
                allFilesSelected ? "bg-secondary/60" : "hover:bg-muted/40"
              )}
            >
              <Checkbox
                checked={allFilesSelected}
                onCheckedChange={() =>
                  setSelectedUrls(
                    allFilesSelected ? [] : files.map((f) => f.fileUrl)
                  )
                }
              />
              <span>Select all files ({files.length})</span>
            </label>
            {filteredFiles.map((file) => {
              const isSelected = selectedUrls.includes(file.fileUrl);
              return (
                <label
                  key={file.fileUrl}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 px-4 py-3 transition",
                    isSelected ? "bg-secondary/60" : "hover:bg-muted/40"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(file.fileUrl)}
                    aria-label={`Select ${file.fileName}`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.fileType.toUpperCase()} ·{" "}
                      {formatFileSize(file.size)}
                      {file.createdAt &&
                        ` · ${formatRelativeTime(file.createdAt)}`}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
