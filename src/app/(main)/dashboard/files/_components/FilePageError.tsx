import { Button } from "@/components/ui/button";
import { QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const FilePageError = ({
  queryClient,
  clerkId,
}: {
  queryClient: QueryClient;
  clerkId: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center p-6">
      <Image
        src="/error.svg"
        alt="Error"
        width={200}
        height={200}
        className="opacity-80"
      />
      <h2 className="text-2xl font-bold text-red-500">Failed to fetch files</h2>
      <p className="text-muted-foreground max-w-md">
        We couldn&#39;t load your files. Please check your connection and try
        again.
      </p>
      <Button
        variant="outline"
        onClick={() =>
          queryClient.refetchQueries({ queryKey: ["files", clerkId] })
        }
      >
        Retry
      </Button>
    </div>
  );
};

export default FilePageError;
