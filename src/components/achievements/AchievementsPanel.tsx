import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AchievementBadge } from "./AchievementBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Medal } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  badge_image_url: string | null;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
}

export const AchievementsPanel = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('id, name, description, points, badge_image_url')
          .order('points', { ascending: true });

        if (achievementsError) throw achievementsError;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_id', user.id);

        if (userAchievementsError) throw userAchievementsError;

        setAchievements(achievementsData || []);
        setUserAchievements(userAchievementsData || []);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading achievements...</div>;
  }

  return (
    <div className="bg-black/50 border border-primary/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Medal className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-xl font-semibold text-white">Achievements</h2>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              name={achievement.name}
              description={achievement.description}
              points={achievement.points}
              imageUrl={achievement.badge_image_url || undefined}
              earned={userAchievements.some(ua => ua.achievement_id === achievement.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};