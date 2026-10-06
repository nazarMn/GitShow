export type RouteParams = Record<string, string>;

export interface UserUpdateBody {
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  YearsOfExperience?: number;
}

export interface CvCreateBody {
  templateId: string;
  name: string;
  avatarUrl: string;
  email?: string;
  location?: string;
}

export interface CVExperienceInput {
  name?: string;
  yearsAndPosition?: string;
  description?: string;
  descriptions?: string[];
}

export interface CvUpdateBody {
  name?: string;
  specialty?: string;
  summary?: string;
  phoneNumber?: string;
  location?: string;
  email?: string;
  references?: string[];
  education?: {
    university?: string;
    specialty?: string;
    startYear?: number | null;
    endYear?: number | null;
  };
  skills?: string[];
  experience?: CVExperienceInput[];
}

export interface ResumeBody {
  title?: string;
  university?: string;
  description?: string;
}

export interface SkillBody {
  titleSkill?: string;
  descriptionSkill?: string;
}

export interface ProjectBody {
  name?: string;
  link?: string;
  description?: string;
  websiteUrl?: string;
}

export interface BookmarkBody {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  websiteUrl?: string;
  userAvatar?: string;
}

export interface MarkReadBody {
  chatId: string;
}

export interface SendMessageBody {
  chatId: string;
  text: string;
}
