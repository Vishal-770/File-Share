import mongoose, { Schema, Document } from "mongoose";

export interface ITeamActivity extends Document {
  teamId: string;
  userId: mongoose.Types.ObjectId;
  action:
    | "created"
    | "joined"
    | "uploaded"
    | "downloaded"
    | "deleted"
    | "left"
    | "invited";
  fileId?: string;
  fileName?: string;
  metadata?: {
    invitedUser?: string;
    invitedUserEmail?: string;
    fileSize?: number;
    fileType?: string;
    teamName?: string;
    fileCount?: number; // For bulk operations
  };
  timestamp: Date;
}

const TeamActivitySchema = new Schema<ITeamActivity>({
  teamId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "FileDropUser",
    required: true,
  },
  action: {
    type: String,
    enum: [
      "created",
      "joined",
      "uploaded",
      "downloaded",
      "deleted",
      "left",
      "invited",
    ],
    required: true,
  },
  fileId: {
    type: String,
    required: false,
  },
  fileName: {
    type: String,
    required: false,
  },
  metadata: {
    invitedUser: String,
    invitedUserEmail: String,
    fileSize: Number,
    fileType: String,
    teamName: String,
    fileCount: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient queries
TeamActivitySchema.index({ teamId: 1, timestamp: -1 });

const TeamActivity =
  (mongoose.models.TeamActivity as mongoose.Model<ITeamActivity>) ||
  mongoose.model("TeamActivity", TeamActivitySchema);

export default TeamActivity;
