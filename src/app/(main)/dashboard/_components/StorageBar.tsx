import { Progress } from "@radix-ui/react-progress";
import React from "react";

type StorageBarProps = {
  current_storage_size: number;
  usagePercent: number;
  max_storage_size: number;
};

const StorageBar = ({
  current_storage_size,
  usagePercent,
  max_storage_size,
}: StorageBarProps) => {
  return (
    <div>
      <div className="w-full lg:w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              {(current_storage_size / 1024 / 1024).toFixed(3)} MB used
            </span>
            <span className="font-medium">{usagePercent.toFixed(2)}%</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-center lg:text-right">
            {(max_storage_size / 1024 / 1024).toFixed(3)} MB total available
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageBar;
