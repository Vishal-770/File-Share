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

export const UploadMultipleFileDetails = async (files: FileDetails[]) => {
  const results = [];
  for (const fileData of files) {
    try {
      await api.post("/api/uploadfile", fileData);
      results.push({ success: true, fileName: fileData.fileName });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(
          `Error Uploading File Data to MongoDb: ${fileData.fileName}`
        );
        results.push({
          success: false,
          fileName: fileData.fileName,
          error: err.message,
        });
      }
    }
  }
  return results;
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

export const DeleteMultipleFileDetails = async (ids: string[]) => {
  try {
    await api.delete("/api/deletefiles", { data: { ids } });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error while Deleting Multiple File Details", err.message);
      throw err;
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
  clerkId,
}: {
  teamId: string;
  fileIds: string[];
  clerkId: string;
}) => {
  try {
    const res = await axios.post("/api/uploadfileteam", {
      teamId,
      fileIds,
      clerkId,
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading file to team:", error);
    throw error;
  }
};

export const DelteTeamFile = async ({
  fileId,
  teamId,
  clerkId,
}: {
  fileId: string;
  teamId: string;
  clerkId: string;
}) => {
  const res = await api.delete("/api/deleteteamfile", {
    params: { fileId, teamId, clerkId },
  });
  console.log(res);
};

export async function UploadPublicFiles(fileUrls: string[]) {
  try {
    const res = await api.post("/api/publicFileUpload", { fileUrls });
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(
      `Failed Uploading Files: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export async function GetPublicFiles(uniqueId: string) {
  try {
    const res = await axios.get(`/api/fetchPublicFiles?uniqueId=${uniqueId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch public files:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unknown error occurred"
    );
  }
}
