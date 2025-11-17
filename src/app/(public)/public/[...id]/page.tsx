"use client";

import { useState, useEffect, useMemo } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { GetPublicFiles } from "@/services/service";
import { extractCleanFileName, handleDownload } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { File, Download, Grid3x3, List, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const PublicFiles = () => {
  const params = useParams();
  const slugParam = params?.id;
  const uniqueId = Array.isArray(slugParam)
    ? slugParam[0]
    : typeof slugParam === "string"
    ? slugParam
    : "";
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBulkDownloadDialog, setShowBulkDownloadDialog] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicFiles", uniqueId],
    queryFn: () => GetPublicFiles(uniqueId),
    enabled: !!uniqueId,
  });

  useEffect(() => {
    // Clear selections when data changes
    setSelectedFiles([]);
  }, [data]);

  const { fileUrls } = data?.data || {};
  const fileCount = fileUrls?.length ?? 0;
  const allSelected = fileCount > 0 && selectedFiles.length === fileCount;
  const hasSelection = selectedFiles.length > 0;

  const selectedFileEntries = useMemo(() => {
    if (!fileUrls) return [];
    return fileUrls
      .map((url: string, index: number) => ({ url, index }))
      .filter(({ url }: { url: string }) => selectedFiles.includes(url))
      .map(({ url, index }: { url: string; index: number }) => {
        let hostname = "";
        try {
          hostname = new URL(url).hostname;
        } catch {
          hostname = "public link";
        }
        return {
          id: `${index}-${url}`,
          url,
          name: extractCleanFileName(url) || `public-file-${index + 1}`,
          host: hostname,
        };
      });
  }, [fileUrls, selectedFiles]);

  useEffect(() => {
    if (showBulkDownloadDialog && selectedFileEntries.length === 0) {
      setShowBulkDownloadDialog(false);
    }
  }, [showBulkDownloadDialog, selectedFileEntries.length]);

  const toggleFileSelection = (url: string) => {
    setSelectedFiles((prev) =>
      prev.includes(url) ? prev.filter((file) => file !== url) : [...prev, url]
    );
  };

  const toggleSelectAll = () => {
    if (!fileUrls) return;
    setSelectedFiles((prev) =>
      prev.length === fileUrls.length ? [] : fileUrls
    );
  };

  const handleOpenBulkDialog = () => {
    if (!hasSelection) {
      toast.warning("Select at least one file to download");
      return;
    }
    setShowBulkDownloadDialog(true);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay error={error} />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Shared Files
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {fileUrls?.length || 0} files available for download
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ModeToggle />
          <div className="flex items-center space-x-2 rounded-full border p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-1"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-1"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>
        </div>
      </div>

      {fileCount > 0 && (
        <div className="rounded-2xl border bg-muted/30 p-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                className="mt-1 h-5 w-5 rounded-md"
              />
              <div>
                <p className="font-semibold text-sm">
                  {hasSelection
                    ? `${selectedFiles.length} selected`
                    : "Choose files to enable bulk actions"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Toggle individual cards or use “Select all” to queue items for
                  download.
                </p>
              </div>
            </div>
            {hasSelection && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedFiles.length} ready
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
              {allSelected ? "Clear selection" : "Select all"}
            </Button>
            {hasSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFiles([])}
              >
                Reset
              </Button>
            )}
            <Button
              size="sm"
              className="gap-2"
              onClick={handleOpenBulkDialog}
              disabled={!hasSelection}
            >
              <Download className="w-4 h-4" />
              Multi Download / ZIP
            </Button>
          </div>
        </div>
      )}

      {fileUrls?.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No files available for download
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fileUrls?.map((url: string, idx: number) => (
            <FileGridCard
              key={idx}
              url={url}
              isSelected={selectedFiles.includes(url)}
              onSelectChange={() => toggleFileSelection(url)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {fileUrls?.map((url: string, idx: number) => (
            <FileListCard
              key={idx}
              url={url}
              isSelected={selectedFiles.includes(url)}
              onSelectChange={() => toggleFileSelection(url)}
            />
          ))}
        </div>
      )}

      <PublicBulkDownloadDialog
        open={showBulkDownloadDialog}
        onOpenChange={setShowBulkDownloadDialog}
        files={selectedFileEntries}
        bundleSlug={uniqueId}
      />
    </div>
  );
};

const FileGridCard = ({
  url,
  isSelected,
  onSelectChange,
}: {
  url: string;
  isSelected: boolean;
  onSelectChange: () => void;
}) => {
  const fileName = extractCleanFileName(url);

  return (
    <Card className="hover:shadow-md transition-shadow relative group">
      <CardHeader className="p-0">
        <div className="absolute top-3 left-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectChange}
            className="h-5 w-5 rounded-md border-2 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 transition-opacity"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <File className="w-6 h-6 text-primary" />
        </div>
        <div className="w-full text-center space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-medium truncate">{fileName}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fileName}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-muted-foreground truncate">
            {new URL(url).hostname}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Button
          size="sm"
          onClick={() => handleDownload(url, fileName)}
          className="gap-2 w-full"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const FileListCard = ({
  url,
  isSelected,
  onSelectChange,
}: {
  url: string;
  isSelected: boolean;
  onSelectChange: () => void;
}) => {
  const fileName = extractCleanFileName(url);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center p-4 gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
          className="h-5 w-5 rounded-md border-2"
        />
        <div className="bg-primary/10 p-3 rounded-full">
          <File className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-medium truncate">{fileName}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fileName}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-sm text-muted-foreground truncate">
            {new URL(url).hostname}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => handleDownload(url, fileName)}
          className="gap-2"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </Card>
  );
};

interface PublicDownloadFile {
  id: string;
  url: string;
  name: string;
  host: string;
}

interface PublicBulkDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: PublicDownloadFile[];
  bundleSlug: string;
}

const PublicBulkDownloadDialog = ({
  open,
  onOpenChange,
  files,
  bundleSlug,
}: PublicBulkDownloadDialogProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [downloadAsZip, setDownloadAsZip] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedIds(files.map((file) => file.id));
      setDownloadAsZip(files.length > 3);
    }
  }, [open, files]);

  const selectedItems = files.filter((file) => selectedIds.includes(file.id));
  const allChecked = selectedIds.length === files.length && files.length > 0;

  const toggle = (id: string) => {
    if (isProcessing) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (isProcessing) return;
    setSelectedIds(allChecked ? [] : files.map((file) => file.id));
  };

  const handleConfirm = async () => {
    if (!selectedItems.length) return;
    setIsProcessing(true);
    try {
      if (downloadAsZip) {
        const zip = new JSZip();
        let added = 0;
        const nameCounts: Record<string, number> = {};
        for (const file of selectedItems) {
          try {
            const response = await fetch(file.url);
            if (!response.ok) throw new Error("Failed to fetch file");
            const blob = await response.blob();
            const baseName = file.name || "public-file";
            const count = nameCounts[baseName] || 0;
            nameCounts[baseName] = count + 1;
            const uniqueName = count ? `${baseName}-${count}` : baseName;
            zip.file(uniqueName, blob);
            added += 1;
          } catch (error) {
            console.error("Failed to add file to zip", file.name, error);
          }
        }

        if (added === 0) {
          throw new Error("No files could be added to the zip");
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${bundleSlug || "public-share"}-${added}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded zip with ${added} file(s)`);
      } else {
        for (const file of selectedItems) {
          await handleDownload(file.url, file.name);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        toast.success(`Started download for ${selectedItems.length} file(s)`);
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Download failed", {
        description: (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isProcessing && onOpenChange(o)}>
      <DialogContent className="max-w-xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" /> Queue Downloads
            </DialogTitle>
            <DialogDescription>
              Review the files you selected from this public share. Bundle them
              into a single zip or download individually.
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
                checked={allChecked}
                onCheckedChange={toggleAll}
                disabled={isProcessing}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-medium">Select All ({files.length})</span>
            </div>
            <span className="text-muted-foreground">
              {selectedIds.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="public-as-zip"
              checked={downloadAsZip}
              onCheckedChange={(value) =>
                !isProcessing && setDownloadAsZip(!!value)
              }
              disabled={isProcessing}
            />
            <label
              htmlFor="public-as-zip"
              className="select-none cursor-pointer text-muted-foreground"
            >
              Download as single .zip
            </label>
          </div>

          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-2 space-y-2">
              {files.map((file) => {
                const checked = selectedIds.includes(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggle(file.id)}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                      checked ? "bg-primary/5 border-primary/30" : "bg-muted/40"
                    } ${
                      isProcessing
                        ? "opacity-60 pointer-events-none"
                        : "cursor-pointer hover:bg-muted/60"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(file.id)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isProcessing}
                    />
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.host}
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
                  No files selected.
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
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0 || isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Preparing...
                </>
              ) : downloadAsZip ? (
                `Download Zip (${selectedIds.length})`
              ) : (
                `Download ${selectedIds.length}`
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-lg" />
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ error }: { error: unknown }) => (
  <div className="max-w-7xl mx-auto p-4 md:p-6">
    <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-center">
      <h2 className="text-xl font-semibold text-destructive mb-2">
        Failed to load files
      </h2>
      <p className="text-destructive">
        {(error as Error).message || "An unknown error occurred"}
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  </div>
);

export default PublicFiles;
