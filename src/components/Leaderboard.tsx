import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  votes: number;
  isTop3: boolean;
}

export const Leaderboard = () => {
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Johnson", votes: 1234, isTop3: true },
    { rank: 2, name: "Michael Chen", votes: 982, isTop3: true },
    { rank: 3, name: "Emma Davis", votes: 879, isTop3: true },
    { rank: 4, name: "James Wilson", votes: 654, isTop3: false },
    { rank: 5, name: "Lisa Anderson", votes: 543, isTop3: false },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Top Performers</h2>
      </div>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-lg ${
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
              <span className="font-medium">{entry.name}</span>
            </div>
            <span className="text-sm text-gray-600">{entry.votes} votes</span>
          </div>
        ))}
      </div>
    </Card>
  );
};