import { Likers } from "@/lib/supabase/feed/feedApi"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          course_category: number | null
          course_level: number | null
          course_name: string | null
          cpi_idx: number | null
          distance: string | null
          h_eng_city: string | null
          h_eng_dong: string | null
          h_eng_gu: string | null
          lead_time: string | null
          loc_x: number | null
          loc_y: number | null
          main_key: string
          pdf_file_path: string | null
          reg_date: string | null
          relate_subway: string | null
          south_north_div: number | null
          vote_cnt: string | null
        }
        Insert: {
          course_category?: number | null
          course_level?: number | null
          course_name?: string | null
          cpi_idx?: number | null
          distance?: string | null
          h_eng_city?: string | null
          h_eng_dong?: string | null
          h_eng_gu?: string | null
          lead_time?: string | null
          loc_x?: number | null
          loc_y?: number | null
          main_key: string
          pdf_file_path?: string | null
          reg_date?: string | null
          relate_subway?: string | null
          south_north_div?: number | null
          vote_cnt?: string | null
        }
        Update: {
          course_category?: number | null
          course_level?: number | null
          course_name?: string | null
          cpi_idx?: number | null
          distance?: string | null
          h_eng_city?: string | null
          h_eng_dong?: string | null
          h_eng_gu?: string | null
          lead_time?: string | null
          loc_x?: number | null
          loc_y?: number | null
          main_key?: string
          pdf_file_path?: string | null
          reg_date?: string | null
          relate_subway?: string | null
          south_north_div?: number | null
          vote_cnt?: string | null
        }
        Relationships: []
      }
      feeds: {
        Row: {
          content: string | null
          id: string
          images:string[] | null
          image_url: string | null
          inserted_at: string
          likers: Likers[] | null
          likes: number
          location: Json | null
          record_id: string;
          updated_at: string
          writer: string
        }
        Insert: {
          content?: string | null
          id?: string
          image_url?: string | null
          inserted_at?: string
          likers?: Likers[] | null
          likes?: number
          location?: Json | null
          record_id?: string;
          updated_at?: string
          writer: string
        }
        Update: {
          content?: string | null
          id?: string
          image_url?: string | null
          inserted_at?: string
          likers?: Likers[] | null
          likes?: number
          location?: Json | null
          record_id?: string;
          updated_at?: string
          writer?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeds_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeds_writer_fkey"
            columns: ["writer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          liked: string[] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          liked?: string[] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          liked?: string[] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      records: {
        Row: {
          avg_pace_sec_per_km: number | null
          calories_kcal: number | null
          created_at: string
          distance_km: number | null
          duration_sec: number | null
          end_lat: number | null
          end_lon: number | null
          id: string
          path_geojson: Json | null
          start_lat: number | null
          start_lon: number | null
          user_id: string
        }
        Insert: {
          avg_pace_sec_per_km?: number | null
          calories_kcal?: number | null
          created_at?: string
          distance_km?: number | null
          duration_sec?: number | null
          end_lat?: number | null
          end_lon?: number | null
          id?: string
          path_geojson?: Json | null
          start_lat?: number | null
          start_lon?: number | null
          user_id?: string
        }
        Update: {
          avg_pace_sec_per_km?: number | null
          calories_kcal?: number | null
          created_at?: string
          distance_km?: number | null
          duration_sec?: number | null
          end_lat?: number | null
          end_lon?: number | null
          id?: string
          path_geojson?: Json | null
          start_lat?: number | null
          start_lon?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_like: {
        Args: { feed_id: string; user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
