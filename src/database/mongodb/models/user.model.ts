import mongoose, { Schema, Document } from "mongoose";
export interface IUsers extends Document {
  clerkId: string;
  email: string;
  first_name: string;
  last_name: string;
  max_storage_size: number;
  current_storage_size: number;
  max_file_upload_size: number;
  max_email_limit: number;
  current_email_sent: number;
  subscription: string;
  teams: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUsers> = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    default: "Unknown",
  },
  last_name: {
    type: String,
    default: " ",
  },

  max_storage_size: {
    type: Number,
    default: 52_428_800,
  },
  current_storage_size: {
    type: Number,
    default: 0,
  },
  max_email_limit: {
    type: Number,
    default: 0,
  },
  current_email_sent: {
    type: Number,
    default: 0,
  },
  max_file_upload_size: {
    type: Number,
    default: 2_097_152,
  },
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});
const User =
  (mongoose.models.FileDropUser as mongoose.Model<IUsers>) ||
  mongoose.model("FileDropUser", UserSchema);
export default User;
