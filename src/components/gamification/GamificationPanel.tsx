import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Leaderboard } from "@/components/Leaderboard";

interface GamificationPanelProps {
  level: number;
  totalVotes: number;
}

export const GamificationPanel = ({ level, totalVotes }: GamificationPanelProps) => {
  return (
    <>
      <div className="absolute left-4 bottom-20 w-72">
        <ParticipantLevel level={level} totalVotes={totalVotes} />
      </div>
      <div className="absolute left-4 top-20 w-72">
        <Leaderboard />
      </div>
    </>
  );
};