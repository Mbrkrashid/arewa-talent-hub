import { Coins, Star } from "lucide-react";
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

export const TokenBalance = () => {
  const [wallet, setWallet] = useState<TokenWallet | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("token_wallets")
        .select("balance, total_earned")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setWallet(data);
      }
    };

    fetchWallet();
  }, []);

  if (!wallet) return null;

  const level = Math.floor(wallet.total_earned / 100) + 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20 animate-glow"
          >
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-medium">{wallet.balance}</span>
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-400">Level {level}</span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your voting power & level</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};