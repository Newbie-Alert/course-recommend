import { pickAndUploadImage } from "@/lib/supabase/common/uploadFile";
import { createFeed, getAllFeeds } from "@/lib/supabase/feed/feed";
import { CreateFeedSchema, FeedSchema } from "@/lib/supabase/feed/types";
import { useFeedInitContext } from "@/providers/FeedInitProvider";
import { useState } from "react";

export default function useFeedScreen() {
  const { userId, location, address } = useFeedInitContext();

  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [feed, setFeed] = useState<FeedSchema[] | null>();
  const [post, setPost] = useState<Partial<CreateFeedSchema>>({
    content: "",
    image_url: "",
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
    const { content, image_url } = post;
    if (!content?.trim()) {
      console.error("content가 없음");
      return;
    }
    if (!userId) return;

    const newFeed = {
      content,
      image_url: image_url || "",
      userId,
      location,
    };

    try {
      await createFeed(newFeed);
      setPost({ content: "", image_url: "" });
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
