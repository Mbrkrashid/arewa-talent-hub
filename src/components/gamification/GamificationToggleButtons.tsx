import { Button } from "@/components/ui/button";

interface GamificationToggleButtonsProps {
  showAchievements: boolean;
  showLeaderboard: boolean;
  onToggleAchievements: () => void;
  onToggleLeaderboard: () => void;
}

export const GamificationToggleButtons = ({
  showAchievements,
  showLeaderboard,
  onToggleAchievements,
  onToggleLeaderboard,
}: GamificationToggleButtonsProps) => {
  if (showAchievements && showLeaderboard) return null;

  return (
    <div className="fixed bottom-20 right-4 flex gap-2">
      {!showAchievements && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onToggleAchievements}
          className="animate-fade-in"
        >
          Show Achievements
        </Button>
      )}
      {!showLeaderboard && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onToggleLeaderboard}
          className="animate-fade-in"
        >
          Show Leaderboard
        </Button>
      )}
    </div>
  );
};