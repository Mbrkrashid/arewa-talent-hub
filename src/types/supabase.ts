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
      token_wallets: {
        Row: {
          id: string
          user_id: string | null
          balance: number | null
          total_earned: number | null
          total_spent: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          points: number | null
          badge_image_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points?: number | null
          badge_image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points?: number | null
          badge_image_url?: string | null
          created_at?: string | null
        }
      }
      judges: {
        Row: {
          id: string
          profile_id: string | null
          expertise: string | null
          bio: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id?: string | null
          expertise?: string | null
          bio?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string | null
          expertise?: string | null
          bio?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      video_content: {
        Row: {
          id: string
          title: string
          thumbnail_url: string | null
          likes_count: number | null
          views_count: number | null
          vendor_id: string
          category_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          thumbnail_url?: string | null
          likes_count?: number | null
          views_count?: number | null
          vendor_id: string
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          thumbnail_url?: string | null
          likes_count?: number | null
          views_count?: number | null
          vendor_id?: string
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
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