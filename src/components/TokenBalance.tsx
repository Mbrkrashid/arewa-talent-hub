import { Coins, Star, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TokenWallet {
  balance: number;
  total_earned: number;
}

interface UserStreak {
  current_streak: number;
  longest_streak: number;
}

export const TokenBalance = () => {
  const [wallet, setWallet] = useState<TokenWallet | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch wallet data
      const { data: walletData } = await supabase
        .from('token_wallets')
        .select('balance, total_earned')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletData) {
        setWallet(walletData);
      }

      // Fetch streak data
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (streakData) {
        setStreak(streakData);
      }
    };

    fetchData();
  }, []);

  if (!wallet) return null;

  const level = Math.floor(wallet.total_earned / 100) + 1;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20 animate-glow"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-medium">{wallet.balance}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your voting power</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Level {level}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your current level</p>
          </TooltipContent>
        </Tooltip>

        {streak && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{streak.current_streak} days</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current streak (Best: {streak.longest_streak} days)</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};