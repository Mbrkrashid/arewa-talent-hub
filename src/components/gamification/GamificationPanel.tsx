import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Leaderboard } from "@/components/Leaderboard";
import { FloatingPanel } from "./FloatingPanel";
import { GamificationToggleButtons } from "./GamificationToggleButtons";
import { useGamificationPreferences } from "@/hooks/use-gamification-preferences";

interface GamificationPanelProps {
  level: number;
  totalVotes: number;
}

export const GamificationPanel = ({ level, totalVotes }: GamificationPanelProps) => {
  const {
    showAchievements,
    showLeaderboard,
    toggleAchievements,
    toggleLeaderboard
  } = useGamificationPreferences();

  return (
    <div className="fixed right-4 top-20 space-y-4 z-50">
      {showAchievements && (
        <FloatingPanel onClose={toggleAchievements}>
          <ParticipantLevel level={level} totalVotes={totalVotes} />
        </FloatingPanel>
      )}
      
      {showLeaderboard && (
        <FloatingPanel onClose={toggleLeaderboard} animationDelay="0.2s">
          <Leaderboard />
        </FloatingPanel>
      )}

      <GamificationToggleButtons
        showAchievements={showAchievements}
        showLeaderboard={showLeaderboard}
        onToggleAchievements={toggleAchievements}
        onToggleLeaderboard={toggleLeaderboard}
      />
    </div>
  );
};