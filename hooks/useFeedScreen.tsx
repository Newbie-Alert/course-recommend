import { pickAndUploadImage } from "@/lib/supabase/common/uploadFile";
import { createFeed, getAllFeeds } from "@/lib/supabase/feed/feedApi";
import { CreateFeedSchema } from "@/lib/supabase/feed/types";
import { useFeedInitContext } from "@/providers/FeedInitProvider";
import { Database } from "@/types/db.types";
import { useState } from "react";

export default function useFeedScreen() {
  const { userId, location, address } = useFeedInitContext();

  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [feed, setFeed] = useState<
    Database["public"]["Tables"]["feeds"]["Row"][] | null
  >();
  const [post, setPost] = useState<Partial<CreateFeedSchema>>({
    content: "",
    thumbnail: "",
  });

  const loadFeeds = async () => {
    try {
      const feeds = await getAllFeeds();
      setFeed(feeds);
    } catch (error) {
      console.log("피드 불러오기 실패");
      setFeed(null);
    }
  };

  const handlePickImage = async () => {
    setImageUploading(true);
    const storagePath = await pickAndUploadImage();
    if (!storagePath) {
      setImageUploading(false);
    }

    try {
      setPost((prev) => ({ ...prev, image_url: storagePath }));
      setImageUploading(false);
    } catch (error) {
      setImageUploading(false);
      console.error("set Image Url Failed");
    }
  };

  const uploadPost = async () => {
    const { content, thumbnail } = post;
    if (!content?.trim()) {
      console.error("content가 없음");
      return;
    }
    if (!userId) return;

    const newFeed = {
      content,
      thumbnail: thumbnail || "",
      userId,
      location,
      title: "",
    };

    try {
      await createFeed(newFeed);
      setPost({ content: "", thumbnail: "" });
      await loadFeeds();
    } catch (error) {
      throw new Error("create Feed Error");
    }
  };
  return {
    feed,
    loadFeeds,
    location,
    address,
    post,
    setPost,
    imageUploading,
    handlePickImage,
    uploadPost,
  };
}
