export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
  /** Google profile photo URL. Null for accounts that never signed in with Google. */
  avatarUrl: string | null;
}

export interface UserProfileDto extends UserDto {
  hasPassword: boolean;
  hasGoogleLinked: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResultDto {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  user: UserDto;
}

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type DocumentStatus =
  | "Uploaded"
  | "Queued"
  | "Processing"
  | "Completed"
  | "Failed";

export interface DocumentDto {
  id: string;
  name: string;
  fileType: "Pdf" | "Docx";
  fileSizeBytes: number;
  status: DocumentStatus;
  processingError: string | null;
  pageCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPageDto {
  pageNumber: number;
  chunkExcerpts: string[];
}

export interface CitationDto {
  documentId: string;
  filename: string;
  page: number;
  chunkExcerpt: string;
}

export interface ConversationSummaryDto {
  id: string;
  title: string;
  lastMessagePreview: string | null;
  updatedAt: string;
}

export interface MessageDto {
  id: string;
  role: "User" | "Assistant" | "System";
  content: string;
  citations: CitationDto[] | null;
  createdAt: string;
}

export interface ConversationDetailDto {
  id: string;
  title: string;
  messages: MessageDto[];
}

export interface AskQuestionResultDto {
  conversationId: string;
  messageId: string;
  answer: string;
  citations: CitationDto[];
  confidence: "High" | "Low";
}

export interface StatisticsDto {
  totalUsers: number;
  totalDocuments: number;
  totalConversations: number;
  totalMessages: number;
  totalStorageBytes: number;
  documentsProcessing: number;
  documentsFailed: number;
}

export interface ApiProblemDetails {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
