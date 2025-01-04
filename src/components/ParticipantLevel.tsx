import { Star, Trophy, Crown, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ParticipantLevelProps {
  level: number;
  totalVotes: number;
}

export const ParticipantLevel = ({ level, totalVotes }: ParticipantLevelProps) => {
  const getLevelInfo = (level: number) => {
    switch (level) {
      case 5:
        return {
          title: "Legendary",
          icon: Crown,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          minVotes: 5000
        };
      case 4:
        return {
          title: "Grand Master",
          icon: Trophy,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/20",
          minVotes: 3000
        };
      case 3:
        return {
          title: "Master",
          icon: Award,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          minVotes: 2000
        };
      case 2:
        return {
          title: "Intermediate",
          icon: Star,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          minVotes: 1000
        };
      default:
        return {
          title: "Beginner",
          icon: Star,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/20",
          minVotes: 0
        };
    }
  };

  const levelInfo = getLevelInfo(level);
  const Icon = levelInfo.icon;
  const nextLevel = level < 5 ? getLevelInfo(level + 1) : null;
  const progress = nextLevel 
    ? ((totalVotes - levelInfo.minVotes) / (nextLevel.minVotes - levelInfo.minVotes)) * 100
    : 100;

  return (
    <Card className={cn(
      "p-4 relative overflow-hidden transition-all",
      levelInfo.bgColor,
      levelInfo.borderColor,
      "animate-glow"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "p-2 rounded-full",
          levelInfo.bgColor,
          "animate-pulse"
        )}>
          <Icon className={cn("h-6 w-6", levelInfo.color)} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{levelInfo.title}</h3>
          <p className="text-sm text-gray-400">{totalVotes} votes</p>
        </div>
      </div>
      
      {nextLevel && (
        <div className="mt-2">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-400">
                  Progress to {nextLevel.title}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <div
                style={{ width: `${progress}%` }}
                className={cn(
                  "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center",
                  levelInfo.bgColor,
                  "animate-pulse"
                )}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};