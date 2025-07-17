import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for file document
export interface IFile extends Document {
  fileName: string;
  filePath: string;
  fileUrl: string;
  size: number;
  fileType: string;
  clerkId: string;
  fileId: string;
  password?: string;
  qrCode?: string;
}

// Define schema
const fileSchema: Schema<IFile> = new Schema<IFile>(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
);

// Avoid model overwrite error in dev
const FileModel: Model<IFile> =
  mongoose.models.File || mongoose.model<IFile>("File", fileSchema);

export default FileModel;
