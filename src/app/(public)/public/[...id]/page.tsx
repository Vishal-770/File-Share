"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GetPublicFiles } from "@/services/service";
import { extractCleanFileName, handleDownload } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { File, Download, Grid3x3, List, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PublicFiles = () => {
  const params = useParams();
  const uniqueId = params?.id as string;
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDownloading, setIsDownloading] = useState(false);

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

  const toggleFileSelection = (url: string) => {
    setSelectedFiles(prev =>
      prev.includes(url)
        ? prev.filter(file => file !== url)
        : [...prev, url]
    );
  };

  const toggleSelectAll = () => {
    if (!fileUrls) return;
    setSelectedFiles(prev =>
      prev.length === fileUrls.length ? [] : fileUrls
    );
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) return;

    setIsDownloading(true);
    try {
      for (const url of selectedFiles) {
        await handleDownload(url, extractCleanFileName(url));
        // Small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      toast(`${selectedFiles.length} file(s) downloaded successfully`);
    } catch {
      toast("Some files failed to download", { 
        description: "Download error", 
        className: "bg-destructive text-white"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay error={error} />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Shared Files</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {fileUrls?.length || 0} files available for download
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-2 py-1">
              {selectedFiles.length} selected
            </Badge>
            <Button
              variant="link"
              size="sm"
              onClick={toggleSelectAll}
              className="text-primary"
            >
              {selectedFiles.length === fileUrls?.length ? "Deselect all" : "Select all"}
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handleBulkDownload}
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download {selectedFiles.length} file(s)
          </Button>
        </div>
      )}

      {fileUrls?.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No files available for download</p>
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