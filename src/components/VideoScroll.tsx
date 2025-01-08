import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";
import { Volume2, VolumeX, Heart, MessageCircle, Share2 } from "lucide-react";
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
            
            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            
            {/* Video controls */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 rounded-full h-12 w-12"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 rounded-full h-12 w-12"
              >
                <Heart className="h-6 w-6" />
                <span className="text-xs mt-1">{video.likes_count || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 rounded-full h-12 w-12"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">0</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 rounded-full h-12 w-12"
              >
                <Share2 className="h-6 w-6" />
                <span className="text-xs mt-1">{video.shares_count || 0}</span>
              </Button>
            </div>

            {/* Video info */}
            <div className="absolute bottom-24 left-4 right-20 text-white">
              <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-white/80 mb-2">@{video.vendor?.business_name || "Anonymous"}</p>
              <p className="text-sm text-white/60 line-clamp-2">{video.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};