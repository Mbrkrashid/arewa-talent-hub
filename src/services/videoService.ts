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
        vendors (
          business_name
        )
      `)
      .order('created_at', { ascending: false })
      .throwOnError();

    if (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }

    if (!data) {
      console.log('No videos found');
      return { data: [], error: null };
    }

    console.log('Raw video data:', data);

    // Transform the response to match the Video interface
    const videos = data.map((item: any): Video => ({
      id: item.id,
      title: item.title,
      description: item.description,
      video_url: item.video_url,
      thumbnail_url: item.thumbnail_url,
      vendor_id: item.vendor_id,
      likes_count: item.likes_count || 0,
      views_count: item.views_count || 0,
      shares_count: item.shares_count || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
      category_id: item.category_id,
      vendor: item.vendors ? {
        business_name: item.vendors.business_name
      } : null
    }));

    console.log("Successfully transformed videos:", videos);
    return { data: videos, error: null };
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    return { data: null, error };
  }
};