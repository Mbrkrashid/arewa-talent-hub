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
import { Diamond, Star, Share2, Trophy } from "lucide-react";
import { TokenBalance } from "./TokenBalance";
import { useToast } from "@/hooks/use-toast";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
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
      <div className="flex items-center justify-between">
        <TokenBalance />
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-black/20"
            onClick={handleInviteFriends}
          >
            <Share2 className="h-4 w-4 mr-2 text-primary" />
            Invite Friends
          </Button>
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