import { supabase } from "@/integrations/supabase/client";

export type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  vendor_id: string;
  likes_count: number | null;
  views_count: number | null;
  shares_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: string | null;
  vendor: {
    business_name: string;
  } | null;
};

export const fetchVideos = async () => {
  console.log("Fetching videos from Supabase...");
  try {
    const { data, error } = await supabase
      .from('video_content')
      .select(`
        *,
        vendor:vendors(business_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }

    // Transform the data to match the Video type
    const transformedData = data?.map(video => ({
      ...video,
      vendor: video.vendor?.[0] || null
    })) as Video[];

    console.log("Successfully fetched videos:", transformedData);
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    return { data: null, error };
  }
};