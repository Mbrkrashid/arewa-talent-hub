import { VideoCard } from "@/components/VideoCard";
import { VideoScroll } from "@/components/VideoScroll";
import type { Video } from "@/services/videoService";

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
  viewMode?: "grid" | "scroll";
}

export const VideoGrid = ({ videos, loading, viewMode = "scroll" }: VideoGridProps) => {
  if (loading) {
    return (
      <div className="col-span-2 text-center py-12 text-gray-400">
        Loading talents...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="col-span-2 text-center py-12 text-gray-400">
        No videos uploaded yet. Be the first to share your talent!
      </div>
    );
  }

  if (viewMode === "scroll") {
    return <VideoScroll videos={videos} loading={loading} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          artist={video.vendors?.business_name || "Anonymous"}
          votes={video.likes_count}
          thumbnailUrl={video.thumbnail_url || "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500"}
          level={video.level || 1}
        />
      ))}
    </div>
  );
};