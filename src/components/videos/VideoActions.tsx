import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoActionsProps {
  videoId: string;
  likesCount: number;
  commentsCount?: number;
  sharesCount: number;
}

export const VideoActions = ({ videoId, likesCount, commentsCount = 0, sharesCount }: VideoActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
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

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already liked",
            description: "You have already liked this video",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setIsLiked(true);
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
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        className={`text-white bg-black/50 rounded-full h-12 w-12 ${isLiked ? 'text-red-500' : ''}`}
        onClick={handleLike}
      >
        <Heart className="h-6 w-6" />
        <span className="text-xs mt-1">{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white bg-black/50 rounded-full h-12 w-12"
        onClick={() => {
          toast({
            title: "Comments",
            description: "Comments feature coming soon!",
          });
        }}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="text-xs mt-1">{commentsCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white bg-black/50 rounded-full h-12 w-12"
        onClick={() => {
          toast({
            title: "Share",
            description: "Share feature coming soon!",
          });
        }}
      >
        <Share2 className="h-6 w-6" />
        <span className="text-xs mt-1">{sharesCount}</span>
      </Button>
    </div>
  );
};