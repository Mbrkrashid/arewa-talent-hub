import { VideoFeed } from "@/components/videos/VideoFeed";
import { VideoCategoryGrid } from "@/components/videos/VideoCategoryGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";

interface ContentSectionProps {
  userRole: 'participant' | 'voter' | null;
}

export const ContentSection = ({ userRole }: ContentSectionProps) => {
  return (
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
  );
};