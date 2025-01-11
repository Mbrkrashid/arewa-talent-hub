import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  votes: number;
  level: string;
  isTop3: boolean;
}

export const Leaderboard = () => {
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Johnson", votes: 1234, level: "Gold", isTop3: true },
    { rank: 2, name: "Michael Chen", votes: 982, level: "Silver", isTop3: true },
    { rank: 3, name: "Emma Davis", votes: 879, level: "Bronze", isTop3: true },
    { rank: 4, name: "James Wilson", votes: 654, level: "Bronze", isTop3: false },
    { rank: 5, name: "Lisa Anderson", votes: 543, level: "Bronze", isTop3: false },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Gold":
        return "text-yellow-500";
      case "Silver":
        return "text-gray-400";
      case "Bronze":
        return "text-amber-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Top Performers</h2>
      </div>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-lg ${
              entry.isTop3
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 animate-glow"
                : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  entry.isTop3 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {entry.rank}
              </span>
              <div>
                <span className="font-medium block">{entry.name}</span>
                <div className="flex items-center gap-1 text-sm">
                  <Star className={`h-4 w-4 ${getLevelColor(entry.level)}`} />
                  <span className={getLevelColor(entry.level)}>{entry.level}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-medium">{entry.votes}</span>
              <span className="text-sm text-gray-500">votes</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};