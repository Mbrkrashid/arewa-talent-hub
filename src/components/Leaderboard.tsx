import { Card } from "@/components/ui/card";
import { Trophy, Star, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  votes: number;
  isTop3: boolean;
  level: number;
}

export const Leaderboard = () => {
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: "Amina Ibrahim", votes: 1234, isTop3: true, level: 10 },
    { rank: 2, name: "Musa Abdullahi", votes: 982, isTop3: true, level: 8 },
    { rank: 3, name: "Yakubu Mohammed", votes: 879, isTop3: true, level: 7 },
    { rank: 4, name: "Aisha Yusuf", votes: 654, isTop3: false, level: 6 },
    { rank: 5, name: "Ibrahim Danladi", votes: 543, isTop3: false, level: 5 },
  ];

  return (
    <Card className="p-6 bg-black/50 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-xl font-semibold text-white">Top Performers</h2>
      </div>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-lg ${
              entry.isTop3
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 animate-glow"
                : "bg-gray-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  entry.isTop3 ? "bg-primary text-white" : "bg-gray-800"
                }`}
              >
                {entry.rank === 1 ? (
                  <Crown className="h-4 w-4 text-yellow-500" />
                ) : (
                  entry.rank
                )}
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-white">{entry.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-400">Level {entry.level}</span>
                </div>
              </div>
            </div>
            <span className="text-sm text-primary">{entry.votes} votes</span>
          </div>
        ))}
      </div>
    </Card>
  );
};