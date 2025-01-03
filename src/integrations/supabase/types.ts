export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      ad_impressions: {
        Row: {
          device_info: Json | null
          id: string
          impression_type: string | null
          location_info: Json | null
          promotion_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          id?: string
          impression_type?: string | null
          location_info?: Json | null
          promotion_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          id?: string
          impression_type?: string | null
          location_info?: Json | null
          promotion_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "vendor_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_revenue: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          revenue_type: string
          updated_at: string | null
          video_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          revenue_type: string
          updated_at?: string | null
          video_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          revenue_type?: string
          updated_at?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_revenue_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          is_super_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_super_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      brand_campaigns: {
        Row: {
          ad_placement: string | null
          brand_name: string
          budget: number
          campaign_title: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          metrics: Json | null
          start_date: string
          status: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          ad_placement?: string | null
          brand_name: string
          budget?: number
          campaign_title: string
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          metrics?: Json | null
          start_date: string
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_placement?: string | null
          brand_name?: string
          budget?: number
          campaign_title?: string
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          metrics?: Json | null
          start_date?: string
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      branded_effects: {
        Row: {
          created_at: string | null
          effect_data: Json
          effect_name: string
          effect_type: string
          id: string
          promotion_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effect_data: Json
          effect_name: string
          effect_type: string
          id?: string
          promotion_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effect_data?: Json
          effect_name?: string
          effect_type?: string
          id?: string
          promotion_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branded_effects_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "vendor_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      hashtag_challenges: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          hashtag: string
          id: string
          participation_count: number | null
          prize_details: Json | null
          promotion_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          hashtag: string
          id?: string
          participation_count?: number | null
          prize_details?: Json | null
          promotion_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          hashtag?: string
          id?: string
          participation_count?: number | null
          prize_details?: Json | null
          promotion_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hashtag_challenges_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "vendor_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_applications: {
        Row: {
          created_at: string | null
          expertise: string
          full_name: string
          id: string
          motivation: string
          portfolio_url: string | null
          profile_id: string | null
          status: string | null
          updated_at: string | null
          years_experience: number
        }
        Insert: {
          created_at?: string | null
          expertise: string
          full_name: string
          id?: string
          motivation: string
          portfolio_url?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string | null
          years_experience: number
        }
        Update: {
          created_at?: string | null
          expertise?: string
          full_name?: string
          id?: string
          motivation?: string
          portfolio_url?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "judge_applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_reviews: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          judge_id: string
          scores: Json
          updated_at: string | null
          video_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          judge_id: string
          scores?: Json
          updated_at?: string | null
          video_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          judge_id?: string
          scores?: Json
          updated_at?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_reviews_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_reviews_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
      judges: {
        Row: {
          application_date: string | null
          application_status: string | null
          bio: string | null
          created_at: string | null
          expertise: string | null
          id: string
          profile_id: string | null
          rating: number | null
          scoring_criteria: Json | null
          status: string | null
          suspension_reason: string | null
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          application_status?: string | null
          bio?: string | null
          created_at?: string | null
          expertise?: string | null
          id?: string
          profile_id?: string | null
          rating?: number | null
          scoring_criteria?: Json | null
          status?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          application_status?: string | null
          bio?: string | null
          created_at?: string | null
          expertise?: string | null
          id?: string
          profile_id?: string | null
          rating?: number | null
          scoring_criteria?: Json | null
          status?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "judges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_levels: {
        Row: {
          benefits: string[] | null
          created_at: string | null
          level: number
          min_votes: number
          name: string
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string | null
          level: number
          min_votes: number
          name: string
        }
        Update: {
          benefits?: string[] | null
          created_at?: string | null
          level?: number
          min_votes?: number
          name?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          opay_merchant_id: string
          payment_type: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          opay_merchant_id: string
          payment_type: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          opay_merchant_id?: string
          payment_type?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_promoted: boolean | null
          name: string
          price: number
          promotion_end_date: string | null
          promotion_start_date: string | null
          promotion_type: string | null
          rating: number | null
          reviews_count: number | null
          sku: string | null
          stock_quantity: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_promoted?: boolean | null
          name: string
          price: number
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_promoted?: boolean | null
          name?: string
          price?: number
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          notification_preferences: Json | null
          participant_level: number | null
          role: string | null
          total_points: number | null
          total_votes: number | null
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          notification_preferences?: Json | null
          participant_level?: number | null
          role?: string | null
          total_points?: number | null
          total_votes?: number | null
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          participant_level?: number | null
          role?: string | null
          total_points?: number | null
          total_votes?: number | null
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string | null
          referrer_id: string | null
          tokens_earned: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          tokens_earned?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          tokens_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_connections: {
        Row: {
          created_at: string | null
          id: string
          is_following: boolean | null
          last_verified_at: string | null
          platform: string
          platform_user_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_following?: boolean | null
          last_verified_at?: string | null
          platform: string
          platform_user_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_following?: boolean | null
          last_verified_at?: string | null
          platform?: string
          platform_user_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_media_videos: {
        Row: {
          created_at: string | null
          description: string | null
          engagement_count: number | null
          id: string
          platform: string
          platform_video_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          engagement_count?: number | null
          id?: string
          platform: string
          platform_video_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          engagement_count?: number | null
          id?: string
          platform?: string
          platform_video_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      sponsored_ads: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          link_url: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      support_chat_history: {
        Row: {
          created_at: string | null
          id: string
          is_ai: boolean | null
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          customer_id: string | null
          description: string
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      token_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_id: string | null
          id: string
          metadata: Json | null
          opay_payment_method: string | null
          opay_payment_status: string | null
          opay_reference_id: string | null
          opay_transaction_details: Json | null
          opay_transaction_id: string | null
          payment_method: string | null
          product_id: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          opay_payment_method?: string | null
          opay_payment_status?: string | null
          opay_reference_id?: string | null
          opay_transaction_details?: Json | null
          opay_transaction_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          opay_payment_method?: string | null
          opay_payment_status?: string | null
          opay_reference_id?: string | null
          opay_transaction_details?: Json | null
          opay_transaction_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          current_streak: number | null
          id: string
          last_activity: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_activity?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_followers: {
        Row: {
          created_at: string | null
          follower_id: string
          id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          id?: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_followers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_promotions: {
        Row: {
          ad_format: string | null
          ad_placement: string | null
          ad_placement_type: string | null
          bid_amount: number | null
          budget: number | null
          clicks_count: number | null
          created_at: string | null
          daily_spend_limit: number | null
          end_date: string
          id: string
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          performance_metrics: Json | null
          product_id: string | null
          promotion_type: string
          start_date: string
          status: string | null
          target_audience: string | null
          target_demographics: Json | null
          targeting_criteria: Json | null
          updated_at: string | null
          vendor_id: string | null
          views_count: number | null
        }
        Insert: {
          ad_format?: string | null
          ad_placement?: string | null
          ad_placement_type?: string | null
          bid_amount?: number | null
          budget?: number | null
          clicks_count?: number | null
          created_at?: string | null
          daily_spend_limit?: number | null
          end_date: string
          id?: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          performance_metrics?: Json | null
          product_id?: string | null
          promotion_type: string
          start_date: string
          status?: string | null
          target_audience?: string | null
          target_demographics?: Json | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
          views_count?: number | null
        }
        Update: {
          ad_format?: string | null
          ad_placement?: string | null
          ad_placement_type?: string | null
          bid_amount?: number | null
          budget?: number | null
          clicks_count?: number | null
          created_at?: string | null
          daily_spend_limit?: number | null
          end_date?: string
          id?: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          performance_metrics?: Json | null
          product_id?: string | null
          promotion_type?: string
          start_date?: string
          status?: string | null
          target_audience?: string | null
          target_demographics?: Json | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_promotions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          business_name: string
          business_type: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_verified: boolean | null
          opay_wallet_id: string | null
          phone_number: string | null
          social_media_links: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          opay_wallet_id?: string | null
          phone_number?: string | null
          social_media_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          opay_wallet_id?: string | null
          phone_number?: string | null
          social_media_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      video_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      video_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          video_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          video_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
      video_content: {
        Row: {
          ban_reason: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_banned: boolean | null
          likes_count: number | null
          music_title: string | null
          music_url: string | null
          shares_count: number | null
          social_media_source: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          vendor_id: string
          video_url: string
          views_count: number | null
        }
        Insert: {
          ban_reason?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_banned?: boolean | null
          likes_count?: number | null
          music_title?: string | null
          music_url?: string | null
          shares_count?: number | null
          social_media_source?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          vendor_id: string
          video_url: string
          views_count?: number | null
        }
        Update: {
          ban_reason?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_banned?: boolean | null
          likes_count?: number | null
          music_title?: string | null
          music_url?: string | null
          shares_count?: number | null
          social_media_source?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string
          video_url?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "video_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_content_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      video_engagement_tracking: {
        Row: {
          created_at: string | null
          engagement_type: string
          id: string
          is_rewarded: boolean | null
          platform: string
          reward_amount: number | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          engagement_type: string
          id?: string
          is_rewarded?: boolean | null
          platform: string
          reward_amount?: number | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          engagement_type?: string
          id?: string
          is_rewarded?: boolean | null
          platform?: string
          reward_amount?: number | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_engagement_tracking_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "social_media_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          tokens_spent: number | null
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          tokens_spent?: number | null
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          tokens_spent?: number | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_interactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_content"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_participation_count:
        | {
            Args: Record<PropertyKey, never>
            Returns: number
          }
        | {
            Args: {
              challenge_id: string
            }
            Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
