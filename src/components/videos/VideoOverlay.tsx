import { VideoControls } from "./VideoControls";
import { VideoActions } from "./VideoActions";
import { VideoInfo } from "./VideoInfo";
import type { Video } from "@/services/videoService";

interface VideoOverlayProps {
  video: Video;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const VideoOverlay = ({ video, isMuted, onToggleMute }: VideoOverlayProps) => {
  return (
    <>
      {/* Video overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      
      {/* Video controls */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6">
        <VideoControls isMuted={isMuted} onToggleMute={onToggleMute} />
        <VideoActions 
          videoId={video.id}
          likesCount={video.likes_count || 0}
          sharesCount={video.shares_count || 0}
        />
      </div>

      <VideoInfo 
        title={video.title}
        artist={video.vendor?.business_name || "Anonymous"}
        description={video.description}
      />
    </>
  );
};