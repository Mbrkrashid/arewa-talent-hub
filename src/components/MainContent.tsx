import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoScroll } from "@/components/VideoScroll";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { toast } = useToast();

  const handleLike = async (videoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like videos",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('video_likes')
        .insert({ video_id: videoId, user_id: user.id });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Video liked successfully",
      });
    } catch (error) {
      console.error('Error liking video:', error);
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <VideoScroll videos={videos} loading={loading} />
      
      {/* Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
          onClick={() => handleLike(videos[currentVideoIndex]?.id)}
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <Share2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <Music2 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};