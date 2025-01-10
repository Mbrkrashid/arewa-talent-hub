import { supabase } from "@/integrations/supabase/client";

interface TikTokVideoData {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
}

export const uploadToTikTok = async (videoData: TikTokVideoData) => {
  try {
    console.log('Initiating TikTok upload process:', videoData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    // Call Supabase Edge Function to handle TikTok upload
    const response = await fetch('/api/tiktok-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.id}`,
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      throw new Error('Failed to upload to TikTok');
    }

    const result = await response.json();
    console.log('TikTok upload successful:', result);
    return result;
  } catch (error) {
    console.error('Error uploading to TikTok:', error);
    throw error;
  }
};