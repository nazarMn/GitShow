import type { Types } from 'mongoose';

export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      _id: Types.ObjectId | string;
      username?: string;
      avatarUrl?: string;
      apiKey?: string;
      bookmarkedProjects?: Array<Record<string, unknown>>;
      followers?: Array<Types.ObjectId | string>;
      following?: Array<Types.ObjectId | string>;
    }
  }
}
