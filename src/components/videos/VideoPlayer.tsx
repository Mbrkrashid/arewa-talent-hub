import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  isMuted: boolean;
  onVideoRef?: (ref: HTMLVideoElement) => void;
}

export const VideoPlayer = ({ videoUrl, isPlaying, isMuted, onVideoRef }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && onVideoRef) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="h-full w-full object-cover"
      loop
      playsInline
      autoPlay={isPlaying}
      muted={isMuted}
    />
  );
};