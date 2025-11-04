import { supabase } from "@/lib/supabase/supabase";

type UploadImageParam = {
  fileName: string;
  arrayBuffer: ArrayBuffer;
  mimeType: string;
};

export default function useImageParser() {
  const imageParser = async (imageUri: string | undefined) => {
    if (!imageUri) return;

    const response = await fetch(imageUri);
    const fileExt = imageUri.split(".").pop();
    const blob = await response.clone().blob();
    const fileName = `image_${Date.now()}.${fileExt}`;
    const arrayBuffer = await response.arrayBuffer();

    const mimeType =
      blob.type ??
      (fileExt === "png"
        ? "image/png"
        : fileExt === "heic"
        ? "image/heic"
        : "image/jpeg");

    return { fileName, arrayBuffer, mimeType };
  };

  // 이미지를 DB에 업로드 후 저장된 경로를 반환
  const handleImageUpload = async ({
    fileName,
    arrayBuffer,
    mimeType,
  }: UploadImageParam) => {
    const { data, error } = await supabase.storage
      .from("feeds")
      .upload(`public/${fileName}`, arrayBuffer, {
        contentType: mimeType,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return;
    }

    return data.path;
  };

  return { imageParser, handleImageUpload };
}
