import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error: PostgrestError | null) => {
  if (!error) return false;
  return error.code === 'PGRST106' || (error as any).status === 406;
};

export const fetchVideos = async (retryCount = 0): Promise<{ data: Video[] | null; error: any }> => {
  console.log('Fetching videos from Supabase...', { attempt: retryCount + 1 });
  
  try {
    const { data, error } = await supabase
      .from('video_content')
      .select(`
        *,
        vendor:vendors (
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      
      // Retry logic with improved error handling
      if (retryCount < MAX_RETRIES && shouldRetry(error)) {
        console.log(`Retrying fetch attempt ${retryCount + 1} of ${MAX_RETRIES}...`);
        await sleep(RETRY_DELAY);
        return fetchVideos(retryCount + 1);
      }
      
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
      vendor: item.vendor ? {
        business_name: item.vendor.business_name
      } : null
    }));

    console.log("Successfully transformed videos:", videos);
    return { data: videos, error: null };
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    return { data: null, error };
  }
};