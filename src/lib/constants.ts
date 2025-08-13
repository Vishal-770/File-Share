/**
 * Application constants
 */

export const APP_CONFIG = {
  name: "File Drop",
  description: "Secure file sharing platform with team collaboration",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  version: "1.0.0",
} as const;

export const FILE_UPLOAD = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",

    // Spreadsheets
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",

    // Presentations
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/x-tar",
    "application/gzip",

    // Audio
    "audio/mpeg",
    "audio/wav",
    "audio/flac",
    "audio/aac",
    "audio/ogg",

    // Video
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/webm",
  ],
} as const;

export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  files: "/dashboard/files",
  teams: "/dashboard/teams",
  settings: "/dashboard/settings",
  publicUpload: "/public",
  share: "/share",
} as const;

export const API_ENDPOINTS = {
  files: "/api/getfiles",
  uploadFile: "/api/uploadfile",
  deleteFile: "/api/deletefile",
  renameFile: "/api/rename",
  teams: "/api/fetchteams",
  createTeam: "/api/createteam",
  deleteTeam: "/api/deleteteam",
  joinTeam: "/api/jointeam",
  leaveTeam: "/api/leaveteam",
  publicFiles: "/api/fetchPublicFiles",
  publicUpload: "/api/publicFileUpload",
  sendEmail: "/api/sendemail",
} as const;

export const THEMES = {
  light: "light",
  dark: "dark",
  system: "system",
} as const;

export const FILE_CATEGORIES = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  document: "Document",
  spreadsheet: "Spreadsheet",
  presentation: "Presentation",
  archive: "Archive",
  file: "File",
} as const;

export const TEAM_ROLES = {
  owner: "owner",
  admin: "admin",
  member: "member",
} as const;

export const SHARING_OPTIONS = {
  private: "private",
  team: "team",
  public: "public",
  password: "password",
} as const;
