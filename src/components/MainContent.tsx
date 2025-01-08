import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoScroll } from "@/components/VideoScroll";
import { useToast } from "@/hooks/use-toast";
import { SideActions } from "@/components/actions/SideActions";
import { TopActions } from "@/components/actions/TopActions";
import { VideoTabs } from "@/components/videos/VideoTabs";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, total_votes, participant_level')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
          setTotalVotes(profile.total_votes || 0);
          setParticipantLevel(profile.participant_level || 1);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full max-w-3xl mx-auto">
      <TopActions userRole={userRole} />
      <VideoTabs videos={videos} loading={loading} />
      <SideActions videos={videos} toast={toast} />
      <GamificationPanel level={participantLevel} totalVotes={totalVotes} />
    </div>
  );
};