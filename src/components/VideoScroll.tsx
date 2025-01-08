import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";
import { VideoControls } from "@/components/videos/VideoControls";
import { VideoActions } from "@/components/videos/VideoActions";
import { VideoInfo } from "@/components/videos/VideoInfo";

interface VideoScrollProps {
  videos: Video[];
  loading: boolean;
}

export const VideoScroll = ({ videos, loading }: VideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id === videos[currentIndex]?.id) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    });
  }, [currentIndex, videos]);

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
            <video
              ref={el => el && (videoRefs.current[video.id] = el)}
              src={video.video_url}
              className="h-full w-full object-cover"
              loop
              playsInline
              autoPlay={inView}
              muted={isMuted}
            />
            
            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            
            {/* Video controls */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6">
              <VideoControls isMuted={isMuted} onToggleMute={toggleMute} />
              <VideoActions 
                likesCount={video.likes_count || 0}
                sharesCount={video.shares_count || 0}
              />
            </div>

            <VideoInfo 
              title={video.title}
              artist={video.vendor?.business_name || "Anonymous"}
              description={video.description}
            />
          </div>
        );
      })}
    </div>
  );
};