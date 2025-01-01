import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Video, Trophy, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoChallengeProps {
  challengeId: string;
  title: string;
  description: string;
  reward: number;
  endDate: Date;
}

export const VideoChallenge = ({ 
  challengeId,
  title, 
  description, 
  reward,
  endDate 
}: VideoChallengeProps) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft(`${days}d ${hours}h left`);
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("Challenge ended");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const handleParticipate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to participate in challenges",
          variant: "destructive",
        });
        return;
      }

      // Upload video to TikTok
      // Note: This is a placeholder for TikTok API integration
      console.log("Uploading to TikTok...");

      // Record participation in Supabase using the RPC function
      const { data, error } = await supabase
        .rpc('increment_participation_count', { challenge_id: challengeId });

      if (error) throw error;

      setIsParticipating(true);
      toast({
        title: "Success!",
        description: "Your video has been submitted to the challenge",
      });
    } catch (error) {
      console.error('Error participating in challenge:', error);
      toast({
        title: "Error",
        description: "Failed to participate in challenge",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-black/50 border border-primary/20 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="h-5 w-5" />
            <span>{reward} tokens</span>
          </div>
          <span className="text-sm text-gray-400 mt-1">{timeLeft}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400">Create video</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-400">Win rewards</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20"
            onClick={() => {
              // Share challenge
              // Note: This is a placeholder for TikTok sharing functionality
              console.log("Sharing challenge...");
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={handleParticipate}
            disabled={isParticipating}
          >
            {isParticipating ? "Participating" : "Participate"}
          </Button>
        </div>
      </div>
    </div>
  );
};