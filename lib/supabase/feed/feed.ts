import { supabase } from "../supabase";

export const getAllFeeds = async () => {
  try {
    let { data: feeds, error } = await supabase
    .from('feeds')
    .select('*')
    
    return feeds
  } catch (error) {
    throw new Error('feed fetch Error');
  }
}

type FeedSchema = {
  content: string;
  image_url: string;
  likes: number;
}

export const createFeed = async ({content,image_url,likes}:FeedSchema) => {
  try {
    const { data, error } = await supabase
  .from('feeds')
  .insert([
    {  },
  ])
  .select()
  } catch (error) {
    
  }
}