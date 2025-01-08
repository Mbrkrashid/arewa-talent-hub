import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Award, Share2, Star, Trophy, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoCardProps {
  id: string;
  title: string;
  artist: string;
  votes: number;
  thumbnailUrl: string;
  level: number;
}

export const VideoCard = ({ id, title, artist, votes, thumbnailUrl, level }: VideoCardProps) => {
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
        if (voteError.code === '23505') { // Unique violation
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
          total_spent: (wallet.total_spent || 0) + 1 // Handle case where total_spent might be null
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

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 5:
        return <Crown className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 4:
        return <Trophy className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 3:
        return <Award className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] duration-300 bg-black/50 border-primary/20 rounded-lg">
      <div className="relative aspect-[9/16] group">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold truncate text-lg">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/80 text-sm">{artist}</p>
            <div className="flex items-center gap-1">
              {getLevelBadge(level)}
              <span className="text-xs text-gray-400">Level {level}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`hover:text-primary ${isVoting ? 'animate-pulse' : ''}`}
            onClick={handleVote}
            disabled={isVoting}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-white">{voteCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary">
            <Award className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
