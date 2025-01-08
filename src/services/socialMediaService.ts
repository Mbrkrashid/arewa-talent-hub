import { supabase } from "@/integrations/supabase/client";

export type SocialPlatform = 'youtube' | 'facebook' | 'telegram' | 'instagram';

export interface SocialMediaConnection {
  platform: SocialPlatform;
  isConnected: boolean;
  username?: string;
}

export const connectSocialMedia = async (platform: SocialPlatform) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('social_media_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single();

    if (existingConnection) {
      console.log(`Already connected to ${platform}`);
      return existingConnection;
    }

    // Create new connection
    const { data: connection, error } = await supabase
      .from('social_media_connections')
      .insert({
        user_id: user.id,
        platform,
        is_following: true,
        platform_user_id: user.id // This would normally come from the platform's OAuth
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Successfully connected to ${platform}:`, connection);
    return connection;
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error);
    throw error;
  }
};

export const getSocialMediaConnections = async (): Promise<SocialMediaConnection[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: connections, error } = await supabase
      .from('social_media_connections')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return connections.map(conn => ({
      platform: conn.platform as SocialPlatform,
      isConnected: conn.is_following,
      username: conn.platform_user_id
    }));
  } catch (error) {
    console.error('Error fetching social media connections:', error);
    return [];
  }
};