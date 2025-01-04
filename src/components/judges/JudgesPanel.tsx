import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Judge {
  id: string;
  profile_id: string;
  expertise: string;
  bio: string;
  status: 'online' | 'offline';
  profiles: {
    avatar_url: string;
    username: string;
  };
}

export const JudgesPanel = () => {
  const [judges, setJudges] = useState<Judge[]>([]);

  useEffect(() => {
    const fetchJudges = async () => {
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

      if (!error && data) {
        setJudges(data);
        console.log("Fetched judges:", data);
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
                <AvatarImage src={judge.profiles?.avatar_url} />
                <AvatarFallback>{judge.profiles?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
                judge.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              } ring-2 ring-white`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{judge.profiles?.username}</h3>
              <p className="text-sm text-gray-400">{judge.expertise}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};