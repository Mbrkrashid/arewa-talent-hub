import { VideoFeed } from "@/components/videos/VideoFeed";
import { VideoCategoryGrid } from "@/components/videos/VideoCategoryGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { JudgesPanel } from "@/components/judges/JudgesPanel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Diamond, Star, Share2, Trophy, Mic, Music2 } from "lucide-react";
import { TokenBalance } from "./TokenBalance";
import { useToast } from "@/hooks/use-toast";
import { ParticipantLevel } from "./ParticipantLevel";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const [participantLevel, setParticipantLevel] = useState(1);
  const [totalVotes, setTotalVotes] = useState(0);
  const { toast } = useToast();

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

        // Get user role and level from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, participant_level, total_votes")
          .eq("id", user.id)
          .single();

        setUserRole(profile?.role as 'participant' | 'voter' || null);
        setParticipantLevel(profile?.participant_level || 1);
        setTotalVotes(profile?.total_votes || 0);
      }
    };

    checkUserStatus();
  }, []);

  const handleInviteFriends = async () => {
    // This would integrate with social media APIs
    toast({
      title: "Share on Social Media",
      description: "Coming soon: Share on WhatsApp, Facebook, and Twitter!",
    });
  };

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="space-y-8">
      {/* Animated Header Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-8 mb-8">
        <div className="absolute top-0 right-0 -translate-y-1/2">
          <Mic className="h-32 w-32 text-primary opacity-20 animate-float" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/2">
          <Music2 className="h-24 w-24 text-secondary opacity-20 animate-dance" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Hausa Talent Show</h1>
          <p className="text-lg text-gray-300">Showcase your talent and reach stardom!</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TokenBalance />
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-black/20 animate-pulse"
            onClick={handleInviteFriends}
          >
            <Share2 className="h-4 w-4 mr-2 text-primary" />
            Invite Friends
          </Button>
          <Button variant="outline" className="bg-black/20">
            <Diamond className="h-4 w-4 mr-2 text-primary animate-pulse" />
            Exchange
          </Button>
          <Button variant="outline" className="bg-black/20">
            <Star className="h-4 w-4 mr-2 text-yellow-500 animate-pulse" />
            Earn
          </Button>
        </div>
      </div>

      {userRole === 'participant' && (
        <ParticipantLevel level={participantLevel} totalVotes={totalVotes} />
      )}

      <JudgesPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {userRole === 'participant' && (
            <div className="mb-8">
              <VideoUpload />
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Featured Talents</h2>
            <VideoFeed />
          </div>

          <VideoCategoryGrid />
        </div>
        
        <div className="space-y-8">
          <Leaderboard />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
};