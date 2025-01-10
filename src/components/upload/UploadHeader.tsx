import { Video, Music2 } from "lucide-react";

export const UploadHeader = () => {
  return (
    <>
      <Video className="h-12 w-12 text-primary animate-pulse" />
      <h3 className="text-lg font-semibold text-white">Share Your Talent</h3>
      <p className="text-sm text-gray-400 text-center">
        Upload your video to participate in the talent show
      </p>
    </>
  );
};