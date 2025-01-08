import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  video_url: string;
  likes_count: number;
  vendor_id: string;
  vendors?: {
    business_name: string;
  } | null;
  level?: number;
  views_count?: number;
  category_id?: string;
  description?: string;
  shares_count?: number;
  created_at?: string;
  updated_at?: string;
}

export const fetchVideos = async (): Promise<{ data: Video[] | null; error: any }> => {
  console.log('Fetching videos from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('video_content')
      .select(`
        id,
        title,
        thumbnail_url,
        video_url,
        likes_count,
        views_count,
        vendor_id,
        category_id,
        description,
        shares_count,
        created_at,
        updated_at,
        vendors (
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return { data: null, error };
    }

    console.log('Successfully fetched videos:', data);
    
    const videosWithLevel = data?.map(video => ({
      ...video,
      level: Math.floor((video.likes_count || 0) / 100) + 1,
      vendors: video.vendors || { business_name: "Anonymous" }
    })) as Video[];

    return { data: videosWithLevel, error: null };
  } catch (error) {
    console.error('Unexpected error in fetchVideos:', error);
    return { data: null, error };
  }
};