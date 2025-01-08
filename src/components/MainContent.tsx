import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SideActions } from "@/components/actions/SideActions";
import { TopActions } from "@/components/actions/TopActions";
import { VideoTabs } from "@/components/videos/VideoTabs";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PrizeDisplay } from "@/components/prizes/PrizeDisplay";
import { SocialMediaConnections } from "@/components/social/SocialMediaConnections";

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
    <div className="fixed inset-0 bg-black">
      {/* Main video container */}
      <div className="relative h-full w-full">
        {/* Video feed */}
        <div className="h-full">
          <VideoTabs videos={videos} loading={loading} />
        </div>

        {/* Overlay elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top section */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4">
            <TopActions userRole={userRole} />
          </div>

          {/* Right side actions */}
          <div className="absolute right-4 bottom-20 z-50 pointer-events-auto">
            <SideActions videos={videos} toast={toast} />
          </div>

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto">
            <div className="p-4 space-y-4">
              <GamificationPanel level={participantLevel} totalVotes={totalVotes} />
              <SocialMediaConnections />
              <BottomNav />
            </div>
          </div>

          {/* Prize display */}
          <div className="absolute top-16 left-0 right-0 z-40">
            <PrizeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};