import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  name: string;
  description: string;
  points: number;
  earned?: boolean;
  imageUrl?: string;
}

export const AchievementBadge = ({ 
  name, 
  description, 
  points, 
  earned = false,
  imageUrl 
}: AchievementBadgeProps) => {
  return (
    <div className={cn(
      "relative p-4 rounded-lg border transition-all",
      earned 
        ? "border-primary bg-primary/10 animate-glow" 
        : "border-gray-800 bg-black/50 opacity-50"
    )}>
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className={cn(
              "w-6 h-6",
              earned ? "text-primary" : "text-gray-500"
            )} />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{description}</p>
          <span className="text-xs text-primary">{points} points</span>
        </div>
        {earned && (
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Earned!
          </div>
        )}
      </div>
    </div>
  );
};