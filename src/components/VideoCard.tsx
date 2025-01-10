import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Star, Trophy, Crown, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoCardProps {
  id: string;
  title: string;
  artist: string;
  votes: number;
  thumbnailUrl: string;
  level: number;
  description?: string;
  viewsCount?: number;
}

export const VideoCard = ({ 
  id, 
  title, 
  artist, 
  votes, 
  thumbnailUrl, 
  level,
  description,
  viewsCount = 0
}: VideoCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);
  const { toast } = useToast();

  const handleVote = async () => {
    try {
      setIsVoting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to vote",
          variant: "destructive",
        });
        return;
      }

      // Check token balance
      const { data: wallet } = await supabase
        .from('token_wallets')
        .select('balance, total_spent')
        .eq('user_id', user.id)
        .single();

      if (!wallet || wallet.balance < 1) {
        toast({
          title: "Insufficient tokens",
          description: "You need at least 1 token to vote",
          variant: "destructive",
        });
        return;
      }

      // Record the vote
      const { error: voteError } = await supabase
        .from('video_likes')
        .insert({ video_id: id, user_id: user.id });

      if (voteError) {
        if (voteError.code === '23505') {
          toast({
            title: "Already voted",
            description: "You have already voted for this video",
            variant: "destructive",
          });
          return;
        }
        throw voteError;
      }

      // Deduct token
      const { error: tokenError } = await supabase
        .from('token_wallets')
        .update({ 
          balance: wallet.balance - 1,
          total_spent: (wallet.total_spent || 0) + 1
        })
        .eq('user_id', user.id);

      if (tokenError) throw tokenError;

      setVoteCount(prev => prev + 1);
      toast({
        title: "Vote recorded!",
        description: "Thank you for supporting this talent",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Voting failed",
        description: "There was an error recording your vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 5:
        return <Crown className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 4:
        return <Trophy className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 3:
        return <Star className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden bg-black/50 border-primary/20 rounded-lg hover:bg-black/60 transition-all duration-300">
      <div className="relative aspect-video group">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            {getLevelBadge(level)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{artist}</span>
              <span>•</span>
              <span>{formatCount(viewsCount)} views</span>
            </div>
            {description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${isVoting ? 'animate-pulse' : ''}`}
              onClick={handleVote}
              disabled={isVoting}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{formatCount(voteCount)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="text-white/80 hover:text-primary">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};