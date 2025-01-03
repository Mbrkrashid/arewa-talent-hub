import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Video, Trophy, Coins } from "lucide-react";

export const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalVoters: 0,
    totalVideos: 0,
    totalTokensInCirculation: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get total participants
        const { count: participantsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'participant');

        // Get total voters
        const { count: votersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'voter');

        // Get total videos
        const { count: videosCount } = await supabase
          .from('video_content')
          .select('*', { count: 'exact', head: true });

        // Get total tokens in circulation
        const { data: tokensData } = await supabase
          .from('token_wallets')
          .select('balance');
        
        const totalTokens = tokensData?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0;

        setStats({
          totalParticipants: participantsCount || 0,
          totalVoters: votersCount || 0,
          totalVideos: videosCount || 0,
          totalTokensInCirculation: totalTokens,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-black/20 border-primary/20">
        <Users className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-lg font-semibold text-white/90">Total Participants</h3>
        <p className="text-3xl font-bold text-primary mt-2">{stats.totalParticipants}</p>
      </Card>

      <Card className="p-6 bg-black/20 border-primary/20">
        <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-white/90">Total Voters</h3>
        <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.totalVoters}</p>
      </Card>

      <Card className="p-6 bg-black/20 border-primary/20">
        <Video className="h-8 w-8 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-white/90">Total Videos</h3>
        <p className="text-3xl font-bold text-green-500 mt-2">{stats.totalVideos}</p>
      </Card>

      <Card className="p-6 bg-black/20 border-primary/20">
        <Coins className="h-8 w-8 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-white/90">Tokens in Circulation</h3>
        <p className="text-3xl font-bold text-blue-500 mt-2">{stats.totalTokensInCirculation}</p>
      </Card>
    </div>
  );
};