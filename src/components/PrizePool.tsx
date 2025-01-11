import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const PrizePool = () => {
  const prizes = [
    { position: 1, amount: "₦2,000,000", color: "from-yellow-500/20 to-yellow-600/20" },
    { position: 2, amount: "₦1,000,000", color: "from-gray-300/20 to-gray-400/20" },
    { position: 3, amount: "₦500,000", color: "from-amber-600/20 to-amber-700/20" },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Prize Pool</h2>
      </div>
      <div className="space-y-3">
        {prizes.map((prize) => (
          <div
            key={prize.position}
            className={`p-4 rounded-lg bg-gradient-to-r ${prize.color} flex items-center justify-between`}
          >
            <span className="font-semibold">
              {prize.position}
              {prize.position === 1
                ? "st"
                : prize.position === 2
                ? "nd"
                : "rd"} Place
            </span>
            <span className="text-lg font-bold">{prize.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};