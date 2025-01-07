import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AnimatedHeader } from "@/components/layout/AnimatedHeader";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ContentSection } from "@/components/content/ContentSection";
import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Mic, Music2, Sparkles, Trophy, Star, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { socialRewardsService } from "@/services/socialRewardsService";
import { useToast } from "@/hooks/use-toast";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const [participantLevel, setParticipantLevel] = useState(1);
  const [totalVotes, setTotalVotes] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: admin } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single();
        
        setIsAdmin(!!admin);

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

  const handleSocialShare = async (platform: string) => {
    try {
      const earnedTokens = await socialRewardsService.trackSocialEngagement(platform);
      if (earnedTokens) {
        toast({
          title: "Tokens Earned!",
          description: `You earned ${earnedTokens} eNaira tokens for sharing on ${platform}!`,
        });
      }
    } catch (error) {
      console.error('Error handling social share:', error);
    }
  };

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 via-black to-secondary/20 p-8 mb-8">
        <div className="absolute top-0 right-0 opacity-20">
          <Mic className="h-32 w-32 text-primary animate-float" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-20">
          <Music2 className="h-24 w-24 text-secondary animate-dance" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Arewa Talent Hub
              </h1>
              <p className="text-lg text-gray-300">
                Share your talent and earn eNaira tokens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm group hover:bg-black/40 transition-all cursor-pointer"
                 onClick={() => handleSocialShare('youtube')}>
              <Trophy className="h-8 w-8 text-red-500 mb-2 mx-auto group-hover:animate-bounce" />
              <p className="text-white text-center text-sm">YouTube</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm group hover:bg-black/40 transition-all cursor-pointer"
                 onClick={() => handleSocialShare('tiktok')}>
              <Star className="h-8 w-8 text-pink-500 mb-2 mx-auto group-hover:animate-pulse" />
              <p className="text-white text-center text-sm">TikTok</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm group hover:bg-black/40 transition-all cursor-pointer"
                 onClick={() => handleSocialShare('facebook')}>
              <Share2 className="h-8 w-8 text-blue-500 mb-2 mx-auto group-hover:animate-dance" />
              <p className="text-white text-center text-sm">Facebook</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm group hover:bg-black/40 transition-all cursor-pointer"
                 onClick={() => handleSocialShare('instagram')}>
              <Music2 className="h-8 w-8 text-purple-500 mb-2 mx-auto group-hover:animate-float" />
              <p className="text-white text-center text-sm">Instagram</p>
            </div>
          </div>
        </div>
      </div>

      <ActionButtons />

      {userRole === 'participant' && (
        <ParticipantLevel level={participantLevel} totalVotes={totalVotes} />
      )}

      <ContentSection userRole={userRole} />
    </div>
  );
};