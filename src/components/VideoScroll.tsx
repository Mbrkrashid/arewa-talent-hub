import { useEffect, useState } from "react";
import { VideoCard } from "@/components/VideoCard";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface VideoScrollProps {
  videos: any[];
  loading: boolean;
}

export const VideoScroll = ({ videos, loading }: VideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { ref: videoRef, inView } = useInView({
    threshold: 0.7,
  });

  useEffect(() => {
    if (inView) {
      console.log("Video in view:", videos[currentIndex]?.title);
    }
  }, [inView, currentIndex, videos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-white/80">Loading videos...</div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white/80">No videos available</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={index === currentIndex ? videoRef : undefined}
          className={cn(
            "h-screen w-full snap-start",
            "flex items-center justify-center",
            index === currentIndex && "opacity-100",
            index !== currentIndex && "opacity-80"
          )}
          onViewportEnter={() => setCurrentIndex(index)}
        >
          <div className="w-full max-w-md mx-auto p-4">
            <VideoCard
              id={video.id}
              title={video.title}
              artist={video.vendors?.business_name || "Anonymous"}
              votes={video.likes_count}
              thumbnailUrl={video.thumbnail_url || "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500"}
              level={Math.floor((video.likes_count || 0) / 100) + 1}
            />
          </div>
        </div>
      ))}
    </div>
  );
};