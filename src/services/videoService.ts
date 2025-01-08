import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  vendor_id: string;
  likes_count: number;
  views_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  vendor?: {
    business_name: string;
  } | null;
}

export const fetchVideos = async () => {
  console.log('Fetching videos from Supabase...');
  try {
    const { data, error } = await supabase
      .from('video_content')
      .select(`
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        vendor_id,
        likes_count,
        views_count,
        shares_count,
        created_at,
        updated_at,
        category_id,
        vendor:vendors (
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }

    // Transform the response to match the Video interface
    const videos = data.map((item: any) => ({
      ...item,
      vendor: item.vendor ? item.vendor[0] : null // Extract first vendor if exists
    })) as Video[];

    console.log("Successfully fetched videos:", videos);
    return { data: videos, error: null };
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    return { data: null, error };
  }
};