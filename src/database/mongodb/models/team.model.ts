import mongoose, { Schema, Document } from "mongoose";

export interface Iteam extends Document {
  teamName: string;
  teamDescription: string;
  teamId: string;
  isPublic: boolean;
  teamLeader: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  files: mongoose.Types.ObjectId[];
}

const TeamSchema = new Schema<Iteam>({
  teamName: {
    type: String,
    required: true,
  },
  teamId: {
    type: String,
    required: true,
  },
  teamDescription: {
    type: String,
    default: "Description Not Set ",
  },

  isPublic: {
    type: Boolean,
    default: false,
    index: true,
  },
  teamLeader: {
    type: Schema.Types.ObjectId,
    ref: "FileDropUser",
  },
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "FileDropUser",
    },
  ],
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

const Team =
  (mongoose.models.Team as mongoose.Model<Iteam>) ||
  mongoose.model("Team", TeamSchema);
export default Team;
