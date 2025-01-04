import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { JudgesPanel } from "@/components/judges/JudgesPanel";
import { AnimatedHeader } from "@/components/layout/AnimatedHeader";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ContentSection } from "@/components/content/ContentSection";
import { ParticipantLevel } from "@/components/ParticipantLevel";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const [participantLevel, setParticipantLevel] = useState(1);
  const [totalVotes, setTotalVotes] = useState(0);

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

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="space-y-8">
      <AnimatedHeader />
      <ActionButtons />

      {userRole === 'participant' && (
        <ParticipantLevel level={participantLevel} totalVotes={totalVotes} />
      )}

      <JudgesPanel />
      <ContentSection userRole={userRole} />
    </div>
  );
};