import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Youtube, BrandTiktok, Instagram, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialVideo {
  id: string;
  title: string;
  description: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  video_url: string;
  thumbnail_url: string;
  engagement_count: number;
}

export const SocialMediaVideos = () => {
  const [videos, setVideos] = useState<SocialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocialVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('social_media_videos')
          .select('*')
          .order('engagement_count', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match our SocialVideo type
        const transformedData = data?.map(video => ({
          ...video,
          platform: video.platform.toLowerCase() as 'youtube' | 'tiktok' | 'instagram'
        })) || [];
        
        setVideos(transformedData);
      } catch (error) {
        console.error('Error fetching social videos:', error);
        toast({
          title: "Error",
          description: "Failed to load social media videos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSocialVideos();
  }, [toast]);

  const handleWatchVideo = async (video: SocialVideo) => {
    try {
      // Track engagement
      const { error } = await supabase
        .from('video_engagement_tracking')
        .insert({
          video_id: video.id,
          engagement_type: 'watch',
          platform: video.platform,
        });

      if (error) throw error;

      // Open video in new tab
      window.open(video.video_url, '_blank');
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'tiktok':
        return <BrandTiktok className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Watch on Social Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden bg-black/50 border-primary/20">
            <div className="relative aspect-video">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                </div>
                {getPlatformIcon(video.platform)}
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => handleWatchVideo(video)}
              >
                Watch Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};