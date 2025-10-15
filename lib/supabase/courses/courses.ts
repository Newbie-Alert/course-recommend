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