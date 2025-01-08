import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoActionsProps {
  likesCount: number;
  commentsCount?: number;
  sharesCount: number;
}

export const VideoActions = ({ likesCount, commentsCount = 0, sharesCount }: VideoActionsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-white bg-black/50 rounded-full h-12 w-12"
      >
        <Heart className="h-6 w-6" />
        <span className="text-xs mt-1">{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white bg-black/50 rounded-full h-12 w-12"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="text-xs mt-1">{commentsCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white bg-black/50 rounded-full h-12 w-12"
      >
        <Share2 className="h-6 w-6" />
        <span className="text-xs mt-1">{sharesCount}</span>
      </Button>
    </>
  );
};