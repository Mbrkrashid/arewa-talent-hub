import { VideoGrid } from "@/components/VideoGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { JudgesDashboard } from "@/components/judges/JudgesDashboard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [isJudge, setIsJudge] = useState(false);

  useEffect(() => {
    const checkJudgeStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: judge } = await supabase
          .from("judges")
          .select("id")
          .eq("profile_id", user.id)
          .single();
        setIsJudge(!!judge);
      }
    };

    checkJudgeStatus();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <VideoUpload />
        </div>
        <div className="mb-8">
          <WalletConnect />
        </div>
        {isJudge ? (
          <JudgesDashboard />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-white/90">Featured Talents</h2>
            <VideoGrid videos={videos} loading={loading} />
          </>
        )}
      </div>
      <div className="space-y-8">
        <Leaderboard />
        <AchievementsPanel />
      </div>
    </div>
  );
};