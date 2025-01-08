import { Heart, MessageCircle, Share2, Music2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ToastProps } from "@/components/ui/toast";

interface SideActionsProps {
  videos: any[];
  toast: (props: ToastProps) => void;
}

export const SideActions = ({ videos, toast }: SideActionsProps) => {
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

  const handleFollow = async (participantId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to follow participants",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('vendor_followers')
        .insert({ vendor_id: participantId, follower_id: user.id });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Now following participant",
      });
    } catch (error) {
      console.error('Error following participant:', error);
      toast({
        title: "Error",
        description: "Failed to follow participant",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        onClick={() => handleLike(videos[0]?.id)}
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
        onClick={() => handleFollow(videos[0]?.vendor_id)}
      >
        <UserPlus className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
      >
        <Music2 className="h-6 w-6" />
      </Button>
    </div>
  );
};