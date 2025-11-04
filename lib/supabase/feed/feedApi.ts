import { supabase } from "../supabase";
import { CreateFeedSchema } from "./types";

export const getAllFeeds = async () => {
    let { data: feeds, error } = await supabase
    .from('feeds')
    .select('*')
    
  if (error) {
    throw new Error('feed fetch Error');
  }

  return feeds
}

export const createFeed = async ({ title,content, thumbnail, userId, location,recordId, images}: CreateFeedSchema) => {
  try {
    const { data, error } = await supabase
  .from('feeds')
  .insert([
    {title, content,thumbnail, writer: userId, location, record_id: recordId, images},
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

export const getFeedImageUrl = (imageName:string | null) => {
  if (!imageName) return;
  
  const { data } = supabase.storage.from('feeds').getPublicUrl(imageName);
  return data.publicUrl
}

export type AddLike = {
  senderId: string;
  feedId: string;
}

export type Likers = {
  senderId: string;
  full_name: string;
}

// 좋아요
export const sendLike = async ({ feedId,  senderId }: AddLike) => {
  const { data: feed, error: fetchErr } = await supabase
    .from("feeds")
    .select("likes, likers")
    .eq("id", feedId)
    .single();
  
  if (fetchErr) throw fetchErr;

  const { data: sender, error: fetchSenderErr } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', senderId)
    .single();
  
  if (fetchSenderErr) throw fetchSenderErr;

  const isLiked = (feed.likers || []).find((item: Likers) => item.senderId === senderId);
  const filteredLikers = (feed.likers || []).filter((item: Likers) => item.senderId !== senderId);

  const updatedLikes = isLiked ? feed.likes - 1 : feed.likes + 1;
  const updatedLikers = isLiked  ? [...filteredLikers || [] ] : [...feed.likers || [], { senderId, full_name: sender.full_name}]

  const { data: updateRes, error: updateErr } = await supabase
    .from('feeds')
    .update({ likes: updatedLikes, likers: updatedLikers as Likers[] })
    .eq('id', feedId)
    .select()
  
  if (updateErr) throw updateErr;

  return updateRes
}