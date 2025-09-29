import { LocationObject } from "expo-location";

export type CreateFeedSchema = {
  content: string;
  image_url?: string;
  userId: string;
  location?: LocationObject|null;
}

export type FeedSchema = {
  id: string;
  writer: string;
  inserted_at: string;
  updated_at: string;
  content: string;
  image_url?: string;
  likes: number;
  location?: LocationObject|null
}