import { LocationObject } from "expo-location";

export type CreateFeedSchema = {
  content: string;
  thumbnail?: string;
  userId: string;
  location?: LocationObject | null;
  recordId?: string;
  title: string;
  images?:string[] | null
}

export type FeedSchema = {
  id: string;
  writer: string;
  inserted_at: string;
  updated_at: string;
  content: string;
  thumbnail?: string;
  images?:string[] | null
  likes: number;
  location?: LocationObject | null
  likers:{senderId:string, full_name:string}[]
}