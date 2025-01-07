export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          role: string | null
          created_at: string
          updated_at: string
          wallet_address: string | null
          total_points: number | null
          notification_preferences: Json | null
          participant_level: number | null
          total_votes: number | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
          wallet_address?: string | null
          total_points?: number | null
          notification_preferences?: Json | null
          participant_level?: number | null
          total_votes?: number | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
          wallet_address?: string | null
          total_points?: number | null
          notification_preferences?: Json | null
          participant_level?: number | null
          total_votes?: number | null
        }
      }
      // Add other table definitions as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}