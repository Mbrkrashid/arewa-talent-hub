import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  uploading: boolean;
}

export const UploadProgress = ({ progress, uploading }: UploadProgressProps) => {
  if (!uploading) return null;

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center text-gray-400">{Math.round(progress)}%</p>
    </div>
  );
};