import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";

interface VideoScrollProps {
  videos: Video[];
  loading: boolean;
}

export const VideoScroll = ({ videos, loading }: VideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-white/80">Loading videos...</div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/80">No videos available</div>
      </div>
    );
  }

  return (
    <div className="h-full snap-y snap-mandatory overflow-y-scroll">
      {videos.map((video, index) => {
        const { ref, inView } = useInView({
          threshold: 0.7,
          onChange: (inView) => {
            if (inView) {
              setCurrentIndex(index);
              console.log("Video in view:", video.title);
            }
          },
        });

        return (
          <div
            key={video.id}
            ref={ref}
            className="h-full w-full snap-start relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
            <video
              src={video.video_url}
              className="h-full w-full object-cover"
              loop
              playsInline
              autoPlay={inView}
              muted={!inView}
            />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-white/80">@{video.vendors?.business_name || "Anonymous"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};