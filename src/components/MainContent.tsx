import { VideoGrid } from "@/components/VideoGrid";
import { VideoUpload } from "@/components/VideoUpload";
import { Leaderboard } from "@/components/Leaderboard";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <VideoUpload />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-white/90">Featured Talents</h2>
        <VideoGrid videos={videos} loading={loading} />
      </div>
      <div>
        <Leaderboard />
      </div>
    </div>
  );
};