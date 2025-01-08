import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const VideoControls = ({ isMuted, onToggleMute }: VideoControlsProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white bg-black/50 rounded-full h-12 w-12"
      onClick={onToggleMute}
    >
      {isMuted ? (
        <VolumeX className="h-6 w-6" />
      ) : (
        <Volume2 className="h-6 w-6" />
      )}
    </Button>
  );
};