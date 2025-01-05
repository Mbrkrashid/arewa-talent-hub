import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AnimatedHeader } from "@/components/layout/AnimatedHeader";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ContentSection } from "@/components/content/ContentSection";
import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Mic, Music2, Sparkles } from "lucide-react";

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
        <div className="relative z-10 flex items-center gap-4">
          <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to Arewa Talent Hub
            </h1>
            <p className="text-lg text-gray-300">
              Discover amazing talents and vote for your favorites
            </p>
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