import { useEffect, useState } from 'react';
import { VideoChallenge } from './VideoChallenge';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/integrations/supabase/types';

type HashtagChallenge = Database['public']['Tables']['hashtag_challenges']['Row'];

interface Challenge {
  id: string;
  hashtag: string;
  description: string;
  prize_details: {
    tokens: number;
  };
  end_date: string;
}

export const ChallengesList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await supabase
          .from('hashtag_challenges')
          .select('*')
          .gt('end_date', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the Challenge interface
        const transformedData: Challenge[] = (data || []).map((challenge: HashtagChallenge) => ({
          id: challenge.id,
          hashtag: challenge.hashtag,
          description: challenge.description || '',
          prize_details: {
            tokens: typeof challenge.prize_details === 'object' && challenge.prize_details !== null 
              ? (challenge.prize_details as { tokens: number }).tokens || 0
              : 0
          },
          end_date: challenge.end_date
        }));

        setChallenges(transformedData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast({
          title: "Error",
          description: "Failed to load challenges",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-40 bg-black/50 border border-primary/20 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <VideoChallenge
          key={challenge.id}
          challengeId={challenge.id}
          title={`#${challenge.hashtag}`}
          description={challenge.description}
          reward={challenge.prize_details.tokens}
          endDate={new Date(challenge.end_date)}
        />
      ))}
    </div>
  );
};