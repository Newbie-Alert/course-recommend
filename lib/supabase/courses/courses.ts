import { supabase } from "../supabase";

export const getCourses = async (startIndex: number, endIndex: number, searchInput?: string) => {
  const safeStart = Math.max(0, startIndex);
  const safeEnd = Math.max(safeStart, endIndex);

  let query = supabase.from('courses').select('*',{count:'exact'});

  if (searchInput && searchInput.trim() !== '') {
    query = query.ilike('h_eng_dong', `%${searchInput}%`);
  }

  query = query.range(safeStart, safeEnd);

  const { data, error, count } = await query;

  if (error?.code === 'PGRST116') {
    return { data: [], total: count ?? 0 };
  }

  if (error) throw Error(error.message);

  return {data, total:count||0}
}

// 구글 장소 검색
const fetchPlaces = async (query: string) => {
    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key":
              process.env.EXPO_PUBLIC_ANDROID_GOOGLE_PLACES_API_KEY!,
            "X-Goog-FieldMask": "*",
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: "ko",
            regionCode: "KR",
          }),
        }
      );

      const data = await res.json();
      return data.places;
    } catch (error) {
      console.log(error);
    }
  };