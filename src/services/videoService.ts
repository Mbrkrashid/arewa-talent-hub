import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  views_count?: number;
  likes_count?: number;
  shares_count?: number;
  category_id?: string;
  isFollowing?: boolean;
  vendor?: {
    business_name: string;
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchVideos = async (attempt = 1): Promise<{ data: Video[] | null; error: PostgrestError | null }> => {
  console.log('Fetching videos from Supabase...', { attempt });
  
  try {
    const { data, error } = await supabase
      .from('video_content')
      .select(`
        *,
        vendor:vendors!inner (
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${attempt + 1} of ${MAX_RETRIES}`);
        await sleep(RETRY_DELAY * attempt); // Exponential backoff
        return fetchVideos(attempt + 1);
      }
      
      return { data: null, error };
    }

    // Transform the data to match the Video interface
    const transformedData = data?.map(video => ({
      ...video,
      vendor: video.vendor,
      isFollowing: false // Default value for isFollowing
    })) as Video[];

    console.log('Successfully fetched videos:', transformedData);
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    
    if (attempt < MAX_RETRIES) {
      console.log(`Retrying... Attempt ${attempt + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * attempt); // Exponential backoff
      return fetchVideos(attempt + 1);
    }
    
    return { data: null, error: error as PostgrestError };
  }
};