import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoScrollProps {
  videos: Video[];
  loading: boolean;
}

export const VideoScroll = ({ videos, loading }: VideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    // Pause all videos except the current one
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-20 right-4 text-white bg-black/50 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-white/80">@{video.vendor?.business_name || "Anonymous"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};