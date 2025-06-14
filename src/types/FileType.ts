export default interface FileDetails {
  _id: string;
  fileName: string;
  fileType: string;
  size: number;
  createdAt: string;
  fileUrl: string;
  filePath: string;
  password?: string;
  fileId: string;
}
export interface PasswordBody {
  password: string;
  fileUrl: string;
}
