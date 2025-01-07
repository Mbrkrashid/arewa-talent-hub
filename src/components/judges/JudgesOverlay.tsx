import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageCircle } from "lucide-react";
import { Judge } from "./types";

export const JudgesOverlay = ({ videoId }: { videoId: string }) => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchJudges = async () => {
      const { data } = await supabase
        .from('judges')
        .select(`
          id,
          profile_id,
          expertise,
          bio,
          status,
          profiles (
            avatar_url,
            username
          )
        `)
        .limit(3);

      if (data) {
        const transformedData = data.map(judge => ({
          ...judge,
          status: judge.status === 'online' ? 'online' : 'offline',
          profiles: judge.profiles?.[0] || null
        })) as Judge[];
        setJudges(transformedData);
      }
    };

    const commentsSubscription = supabase
      .channel('judge-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_comments',
          filter: `video_id=eq.${videoId}`,
        },
        (payload) => {
          setComments((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    fetchJudges();

    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [videoId]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {judges.map((judge) => (
        <Card 
          key={judge.id} 
          className="p-4 bg-black/80 backdrop-blur-sm border-primary/20 w-64 animate-float"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={judge.profiles?.avatar_url || undefined} />
                <AvatarFallback>{judge.profiles?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
                  judge.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                } ring-2 ring-black`} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{judge.profiles?.username}</h3>
              <p className="text-xs text-gray-400">{judge.expertise}</p>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-300">Rating Pending</span>
          </div>
          
          <div className="mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MessageCircle className="h-3 w-3" />
              <span>Latest Feedback</span>
            </div>
            {comments
              .filter(c => c.user_id === judge.profile_id)
              .slice(-1)
              .map((comment, i) => (
                <p key={i} className="text-sm text-gray-300 mt-1">
                  {comment.comment}
                </p>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
};