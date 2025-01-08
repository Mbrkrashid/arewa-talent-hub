import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";
import { VideoPlayer } from "./videos/VideoPlayer";
import { VideoOverlay } from "./videos/VideoOverlay";

interface VideoScrollProps {
  videos: Video[];
  loading: boolean;
}

export const VideoScroll = ({ videos, loading }: VideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.values(videoRefs.current).forEach(video => {
      video.muted = !isMuted;
    });
  };

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
            <VideoPlayer
              videoUrl={video.video_url}
              isPlaying={inView}
              isMuted={isMuted}
              onVideoRef={el => el && (videoRefs.current[video.id] = el)}
            />
            
            <VideoOverlay
              video={video}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </div>
        );
      })}
    </div>
  );
};