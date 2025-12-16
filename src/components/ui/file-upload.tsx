"use client";

import React, { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { IconUpload } from "@tabler/icons-react";
import { motion } from "framer-motion";

export const FileUpload = ({
  onChange,
  resetKey = "",
}: {
  onChange?: (files: File[]) => void;
  resetKey?: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Clear native input when parent requests a reset
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  const handleIncoming = (incoming: File[]) => {
    onChange?.(incoming);
    // Clear native input so selecting same file again triggers change
    if (inputRef.current) inputRef.current.value = "";
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (accepted) => handleIncoming(accepted),
    noClick: true,
    multiple: true,
  });

  const triggerInput = () => inputRef.current?.click();

  return (
    <div {...getRootProps()} className="w-full">
      <div
        onClick={triggerInput}
        className="w-28 h-28 mx-auto flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-blue-400 transition-all cursor-pointer relative group"
      >
        <input
          type="file"
          multiple
          ref={inputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleIncoming(Array.from(e.target.files));
          }}
        />

        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300"
        >
          <IconUpload className="w-6 h-6" />
          <p className="text-xs mt-1">{isDragActive ? "Drop it" : "Upload"}</p>
        </motion.div>

        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity blur-sm pointer-events-none" />
      </div>
    </div>
  );
};
