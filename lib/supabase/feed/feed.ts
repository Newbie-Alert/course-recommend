import { supabase } from "../supabase";
import { CreateFeedSchema, FeedSchema } from "./types";

export const getAllFeeds = async ():Promise<FeedSchema[] | null> => {
    let { data: feeds, error } = await supabase
    .from('feeds')
    .select('*')
    
  if (error) {
    throw new Error('feed fetch Error');
  }

  return feeds
}


export const createFeed = async ({ content, image_url, userId, location}: CreateFeedSchema) => {
  try {
    const { data, error } = await supabase
  .from('feeds')
  .insert([
    {content, image_url, writer: userId, location},
  ]).select()
    if (error) {
      console.log('insertError: error', error);
      return
    }
    
    console.log('insertData', data)
  } catch (error) {
    throw new Error(`supabase insert Feed Error:: ${error}`)
  }
}

export const getFeedImageUrl = (imageName:string | undefined) => {
  if (!imageName) return;
  
  const { data } = supabase.storage.from('feeds').getPublicUrl(imageName);
  return data.publicUrl
}