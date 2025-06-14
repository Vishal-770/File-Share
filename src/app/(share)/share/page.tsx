import dbConnect from "@/database/mongodb/dbConnect";
import FileModel from "@/database/mongodb/models/file.model";
 // client component

import { notFound } from "next/navigation";
import React from "react";
import FilePreview from "./_compoents/FilePreview";
import PasswordForm from "./_compoents/PasswordForm";

const SharePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ fileId?: string }>;
}) => {
  const { fileId } = await searchParams;

  if (!fileId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">❗ File ID is required.</h1>
      </div>
    );
  }

  try {
    await dbConnect();
    const file = await FileModel.findOne({ fileId });

    if (!file) return notFound();

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {file.password ? (
          <PasswordForm file={JSON.parse(JSON.stringify(file))} />
        ) : (
          <FilePreview file={JSON.parse(JSON.stringify(file))} />
        )}
      </div>
    );
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-red-600">
          ❌ {err instanceof Error ? err.message : "Unknown error"}
        </h1>
      </div>
    );
  }
};

export default SharePage;
