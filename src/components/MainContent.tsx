import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SideActions } from "@/components/actions/SideActions";
import { TopActions } from "@/components/actions/TopActions";
import { VideoTabs } from "@/components/videos/VideoTabs";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PrizeDisplay } from "@/components/prizes/PrizeDisplay";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [participantLevel, setParticipantLevel] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, total_votes, participant_level')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (profile) {
            setUserRole(profile.role);
            setTotalVotes(profile.total_votes || 0);
            setParticipantLevel(profile.participant_level || 1);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full max-w-3xl mx-auto bg-black/20">
      <div className="safe-top">
        <TopActions userRole={userRole} />
        <PrizeDisplay />
      </div>
      <div className="h-full overflow-hidden">
        <VideoTabs videos={videos} loading={loading} />
      </div>
      <div className="safe-bottom">
        <SideActions videos={videos} toast={toast} />
        <GamificationPanel level={participantLevel} totalVotes={totalVotes} />
        <BottomNav />
      </div>
    </div>
  );
};