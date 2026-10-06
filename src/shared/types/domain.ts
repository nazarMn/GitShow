export interface UserSummary {
  _id: string;
  id?: string;
  username?: string;
  avatarUrl?: string;
}

export interface Contribution {
  date: string;
  count: number;
}

export interface UserProfile extends UserSummary {
  name?: string;
  profileUrl?: string;
  apiKey?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  YearsOfExperience?: number;
  contributions?: Contribution[];
  followers?: UserSummary[];
  following?: UserSummary[];
}

export interface ProjectRecord {
  _id?: string;
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  image?: File;
  link?: string;
  url?: string;
  websiteUrl?: string;
  homepage?: string;
  userId?: string;
  userAvatar?: string;
}

export interface ResumeRecord {
  _id?: string;
  id?: string;
  title?: string;
  university?: string;
  description?: string;
}

export interface SkillRecord {
  _id?: string;
  titleSkill?: string;
  descriptionSkill?: string;
}

export interface CVExperience {
  _id?: string;
  name: string;
  yearsAndPosition: string;
  description?: string;
  descriptions?: string[];
}

export interface CVRecord {
  _id?: string;
  name?: string;
  avatarUrl?: string;
  specialty?: string;
  summary?: string;
  phoneNumber?: string;
  location?: string;
  email?: string;
  references?: string[];
  skills?: string[];
  education?: {
    university?: string;
    specialty?: string;
    startYear?: number | string | null;
    endYear?: number | string | null;
  };
  experience?: CVExperience[];
}

export interface ChatMessage {
  _id?: string;
  id?: string;
  chatId: string;
  sender: string | UserSummary;
  text: string;
  createdAt?: string | number | Date;
}

export type FollowListType = 'followers' | 'following';
