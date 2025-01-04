import { VideoGrid } from "@/components/VideoGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ChallengesList } from "@/components/challenges/ChallengesList";
import { SocialMediaVideos } from "@/components/social/SocialMediaVideos";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Diamond, Grid, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenBalance } from "./TokenBalance";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid');

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is an admin
        const { data: admin } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single();
        
        setIsAdmin(!!admin);

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

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <TokenBalance />
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-black/20">
            <Diamond className="h-4 w-4 mr-2 text-primary" />
            Exchange
          </Button>
          <Button variant="outline" className="bg-black/20">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Earn
          </Button>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black/30 border-primary/20 p-4 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white">Daily Challenge</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">0/40</span>
                </div>
              </Card>
              <Card className="bg-black/30 border-primary/20 p-4 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white">Weekly Challenge</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">0/100</span>
                </div>
              </Card>
              <Card className="bg-black/30 border-primary/20 p-4 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white">Monthly Challenge</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">0/500</span>
                </div>
              </Card>
            </div>
          </div>

          <div className="mb-8">
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
          </div>
        </div>
        
        <div className="space-y-8">
          <Leaderboard />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
};
