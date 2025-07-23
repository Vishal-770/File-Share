import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublicFile extends Document {
  fileUrls: string[];
  qrCode: string;
  uniqueId: string;
}

const PublicFileSchema: Schema<IPublicFile> = new Schema(
  {
    fileUrls: {
      type: [String],
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PublicFile: Model<IPublicFile> =
  mongoose.models.PublicFile ||
  mongoose.model<IPublicFile>("PublicFile", PublicFileSchema);

export default PublicFile;
