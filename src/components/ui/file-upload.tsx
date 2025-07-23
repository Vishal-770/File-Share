"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Make sure you're using framer-motion, not motion/react
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const uniqueFiles = newFiles.filter(
      (file) => !files.find((f) => f.name === file.name && f.size === file.size)
    );
    const updatedFiles = [...files, ...uniqueFiles];
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(
      (file) =>
        file.name !== fileToRemove.name || file.size !== fileToRemove.size
    );
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative w-full mt-10  mx-auto max-h-80 overflow-y-auto custom-scroll space-y-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
            {files.map((file, idx) => (
              <motion.div
                key={file.name + idx}
                layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                className={cn(
                  "relative overflow-hidden z-40 bg-white dark:bg-neutral-900",
                  "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                  "p-4 pr-12 mt-4 w-full mx-auto rounded-md shadow-sm"
                )}
              >
                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  aria-label="Remove file"
                >
                  <IconX size={16} className="text-destructive" />
                </button>

                <div className="flex flex-col gap-2 w-full">
                  {/* Top row: File name and size */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input shrink-0"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  {/* Bottom row: File type and modified date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 inline-block"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      Modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable background grid pattern
export function GridPattern() {
  const columns = 41;
  const rows = 11;

  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105 z-0">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
