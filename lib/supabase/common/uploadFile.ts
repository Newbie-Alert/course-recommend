import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";

/**
 * 
 * @returns supabase storage에 업로드 후 이미지 저장 경로 반환
 */
export const pickAndUploadImage = async () => {
  // 1. 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 1,
    allowsEditing: true,
    aspect: [1, 1],
    base64: false,
  });

  if (result.canceled) return;

  const asset = result.assets[0];
  const uri = asset.uri;
  const fileExt = uri.split('.').pop();
  const fileName = `image_${Date.now()}.${fileExt}`;

  // 2. 파일을 fetch로 Blob으로 불러오기
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

    const mimeType =
    asset.mimeType ??
    (fileExt === "png"
      ? "image/png"
      : fileExt === "heic"
      ? "image/heic"
        : "image/jpeg");
  

  // 3. Supabase Storage 업로드
  const { data, error } = await supabase.storage
    .from("feeds")
    .upload(`public/${fileName}`, arrayBuffer, {
      contentType: mimeType,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return;
  }

  console.log("Uploaded path:", data.path);

  return data.path;
};
