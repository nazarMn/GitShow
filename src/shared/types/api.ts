import type { CVRecord } from './domain';

export interface CurrentUserResponse {
  id: string;
}

export interface ExperienceResponse {
  YearsOfExperience?: number | string | null;
}

export interface ApiMessageResponse {
  message?: string;
}

export interface CvCheckResponse {
  hasCV: boolean;
}

export interface CvShareLinkResponse {
  shareableLink: string;
}

export interface CvMutationResponse extends ApiMessageResponse {
  cv?: CVRecord;
  shareableLink?: string;
}

export interface AvatarUploadResponse {
  avatarUrl?: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
