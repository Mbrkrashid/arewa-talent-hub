import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Judge } from "./types";

export const JudgesPanel = () => {
  const [judges, setJudges] = useState<Judge[]>([]);

  useEffect(() => {
    const fetchJudges = async () => {
      console.log('Fetching judges...');
      try {
        const { data, error } = await supabase
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

        if (error) {
          console.error('Error fetching judges:', error);
          return;
        }

        console.log('Fetched judges:', data);
        if (data) {
          const transformedData: Judge[] = data.map(judge => ({
            id: judge.id,
            profile_id: judge.profile_id,
            expertise: judge.expertise,
            bio: judge.bio,
            status: (judge.status === 'online' ? 'online' : 'offline') as 'online' | 'offline',
            profiles: judge.profiles ? {
              avatar_url: judge.profiles.avatar_url || null,
              username: judge.profiles.username || null
            } : null
          }));
          
          setJudges(transformedData);
        }
      } catch (error) {
        console.error('Error in fetchJudges:', error);
      }
    };

    fetchJudges();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {judges.map((judge) => (
        <Card key={judge.id} className="p-4 bg-black/30 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={judge.profiles?.avatar_url || undefined} />
                <AvatarFallback>{judge.profiles?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
                judge.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              } ring-2 ring-white`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{judge.profiles?.username}</h3>
              <p className="text-xs text-gray-400">{judge.expertise}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};