import { Trophy, Award, Medal } from "lucide-react";
import { motion } from "framer-motion";

export const PrizeDisplay = () => {
  const prizes = [
    { position: 1, amount: "₦1,000,000", icon: Trophy, color: "text-yellow-500" },
    { position: 2, amount: "₦500,000", icon: Award, color: "text-gray-300" },
    { position: 3, amount: "₦250,000", icon: Medal, color: "text-amber-600" }
  ];

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Earn Points</h3>
        <div className="space-y-4">
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.position}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: index
                }}
              >
                <prize.icon className={`h-6 w-6 ${prize.color}`} />
              </motion.div>
              <div className="text-white">
                <span className="text-sm opacity-80">#{prize.position}</span>
                <p className="font-semibold">{prize.amount}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};