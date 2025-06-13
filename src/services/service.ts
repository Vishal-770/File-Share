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
    const req = await api.post("/api/uploadfile", data);
    console.log(req);
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
    const res = await api.delete(`/api/deletefile?id=${id}`);
    console.log(res);
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
    const res = await api.patch("/api/rename", data);
    console.log(res);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
  }
};
