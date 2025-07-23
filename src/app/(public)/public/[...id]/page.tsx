"use client";

import { Button } from "@/components/ui/button";
import { GetPublicFiles } from "@/services/service";
import { extractCleanFileName, handleDownload } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { File, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const PublicFiles = () => {
  const params = useParams();
  const uniqueId = params?.id as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicFiles", uniqueId],
    queryFn: () => GetPublicFiles(uniqueId),
    enabled: !!uniqueId,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay error={error} />;

  const { fileUrls } = data.data || {};

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Shared Files</h1>
        <p className="text-muted-foreground">
          Download the files shared with you
        </p>
      </div>

      {fileUrls?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No files available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fileUrls?.map((url: string, idx: number) => (
            <FileCard key={idx} url={url} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileCard = ({ url }: { url: string }) => {
  const fileName = extractCleanFileName(url);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <File className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{fileName}</p>
          <p className="text-sm text-muted-foreground truncate">
            {new URL(url).hostname}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          size="sm"
          onClick={() => handleDownload(url, fileName)}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto p-6 space-y-8">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ error }: { error: unknown }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="bg-destructive/10 p-6 rounded-lg border border-destructive text-center">
      <h2 className="text-xl font-semibold text-destructive mb-2">
        Failed to load files
      </h2>
      <p className="text-destructive">
        {(error as Error).message || "An unknown error occurred"}
      </p>
    </div>
  </div>
);

export default PublicFiles;
