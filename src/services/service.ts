export interface CreateTeam {
  teamName: string;
  teamDescription: string;
  clerkId: string;
}
import { PasswordBody } from "@/types/FileType";
import axios from "axios";

export interface FileDetails {
  fileName: string;
  fileUrl: string;
  size: number;
  clerkId: string;
  fileType: string;
  password?: string;
  filePath: string;
}

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const api = axios.create({
  baseURL: BaseUrl,
});

export const UploadFileDetails = async (data: FileDetails) => {
  try {
    await api.post("/api/uploadfile", data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error Uploading File Data to MongoDb");
      return null;
    }
  }
};
export const getFileDetails = async (clerkId: string) => {
  try {
    const res = await api.get(`/api/getfiles?id=${clerkId}`);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { files: [] };
    } else {
      console.log("Unknown Error Occured");
      return [];
    }
  }
};

export const DeleteFileDetails = async (id: string) => {
  try {
    await api.delete(`/api/deletefile?id=${id}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error while Deleting File Details", err.message);
      return;
    }
  }
};
export interface UpdateFileNameData {
  _id: string;
  fileName: string;
}

export const UpdateFileName = async (
  data: UpdateFileNameData
): Promise<void> => {
  try {
    await api.patch("/api/rename", data);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
  }
};
export const UpdatePassword = async (data: PasswordBody) => {
  try {
    const res = await api.patch("/api/password", data);
    console.log(res);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};

interface SendEmailProps {
  recipientEmail: string;
  senderName: string;
  shareUrls: string[];
}

export const SendEmail = async ({
  recipientEmail,
  senderName,
  shareUrls,
}: SendEmailProps) => {
  try {
    const response = await axios.post("/api/sendemail", {
      recipientEmail,
      senderName,
      shareUrls,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export const FetchUser = async (clerkId: string) => {
  try {
    const response = await api.get(`/api/fetchuser?id=${clerkId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user:", error);
  }
};

export const CreateTeam = async (data: CreateTeam) => {
  try {
    await api.post("/api/createteam", data);
  } catch (err) {
    console.error("Error:", err);
  }
};

export const FetchTeams = async (teamIds: string[]) => {
  try {
    const response = await api.post("/api/fetchteams", { teamIds });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching teams:", error);
    return null;
  }
};

export const DeleteTeam = async (teamId: string) => {
  try {
    const res = await axios.delete(`/api/deleteteam`, {
      params: { id: teamId },
    });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
};
export const JoinTeam = async ({
  teamId,
  clerkId,
}: {
  teamId: string;
  clerkId: string;
}) => {
  const res = await axios.patch("/api/jointeam", { teamId, clerkId });
  return res.data;
};

export const LeaveTeam = async ({
  teamId,
  clerkId,
}: {
  teamId: string;
  clerkId: string;
}) => {
  try {
    const res = await axios.patch("/api/leaveteam", { teamId, clerkId });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error leaving team:", error);
  }
};

export const FetchTeam = async (teamId: string) => {
  const res = await axios.get("/api/fetchteam", {
    params: { teamId },
  });
  return res.data.team;
};

export const UploadFilesToTeam = async ({
  teamId,
  fileIds,
}: {
  teamId: string;
  fileIds: string[];
}) => {
  try {
    const res = await axios.post("/api/uploadfileteam", { teamId, fileIds });
    return res.data;
  } catch (error) {
    console.error("Error uploading file to team:", error);
    throw error;
  }
};
