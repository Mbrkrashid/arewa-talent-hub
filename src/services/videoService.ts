import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  likes_count: number;
  vendor_id: string;
  vendors?: {
    business_name: string;
  };
  level?: number;
}

export const fetchVideos = async (): Promise<{ data: Video[] | null; error: any }> => {
  console.log('Fetching videos from Supabase...');
  
  const { data, error } = await supabase
    .from('video_content')
    .select(`
      *,
      vendors (
        business_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching videos:', error);
    return { data: null, error };
  }

  console.log('Successfully fetched videos:', data);
  
  const videosWithLevel = data?.map(video => ({
    ...video,
    level: Math.floor((video.likes_count || 0) / 100) + 1,
    vendors: video.vendors || { business_name: "Anonymous" }
  })) || [];

  return { data: videosWithLevel, error: null };
};