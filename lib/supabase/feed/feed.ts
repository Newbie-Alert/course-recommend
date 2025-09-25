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

export type FeedSchema = {
  content: string;
  image_url?: string;
  userId: string;
}

export const createFeed = async ({content,image_url,userId}:FeedSchema) => {
  try {
    const { data, error } = await supabase
  .from('feeds')
  .insert([
    {content, image_url, writer:userId},
  ]).select()
    
    console.log('insertData', data)
  } catch (error) {
    throw new Error(`supabase insert Feed Error:: ${error}`)
  }
}