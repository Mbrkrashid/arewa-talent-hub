import { VideoGrid } from "@/components/VideoGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { JudgesDashboard } from "@/components/judges/JudgesDashboard";
import { ChallengesList } from "@/components/challenges/ChallengesList";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Users, Grid, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isJudge, setIsJudge] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid');

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is a judge
        const { data: judge } = await supabase
          .from("judges")
          .select("id")
          .eq("profile_id", user.id)
          .single();
        
        setIsJudge(!!judge);

        // Get user role from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(profile?.role as 'participant' | 'voter' || null);
      }
    };

    checkUserStatus();
  }, []);

  return (
    <div className="space-y-8">
      {/* Prize Pool Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
          <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">1st Prize</h3>
          <p className="text-3xl font-bold text-yellow-500">₦2,000,000</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/20">
          <Trophy className="h-8 w-8 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">2nd Prize</h3>
          <p className="text-3xl font-bold text-gray-400">₦1,000,000</p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/20">
          <Trophy className="h-8 w-8 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">3rd Prize</h3>
          <p className="text-3xl font-bold text-orange-500">₦500,000</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {userRole === 'participant' && (
            <div className="mb-8">
              <VideoUpload />
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Active Challenges</h2>
            <ChallengesList />
          </div>
          
          {isJudge ? (
            <JudgesDashboard />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white/90">Featured Talents</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'scroll' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('scroll')}
                  >
                    <ScrollText className="h-4 w-4 mr-2" />
                    Scroll
                  </Button>
                </div>
              </div>
              <VideoGrid videos={videos} loading={loading} viewMode={viewMode} />
            </>
          )}
        </div>
        
        <div className="space-y-8">
          <Leaderboard />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
};
