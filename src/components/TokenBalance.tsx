import { useState } from "react";
import { Coins, Star, Trophy, Flame, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

type TokenWallet = Database['public']['Tables']['token_wallets']['Row'];
type UserStreak = Database['public']['Tables']['user_streaks']['Row'];
type TokenTransaction = Database['public']['Tables']['token_transactions']['Row'];

export const TokenBalance = () => {
  const [wallet, setWallet] = useState<TokenWallet | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching wallet data for user:", user.id);

      // Fetch wallet data
      const { data: walletData, error: walletError } = await supabase
        .from('token_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) {
        console.error("Error fetching wallet:", walletError);
      } else if (walletData) {
        console.log("Wallet data:", walletData);
        setWallet(walletData);
      }

      // Fetch streak data
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (streakError) {
        console.error("Error fetching streak:", streakError);
      } else if (streakData) {
        console.log("Streak data:", streakData);
        setStreak(streakData);
      }

      // Fetch transaction history
      const { data: transactionData, error: transactionError } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionError) {
        console.error("Error fetching transactions:", transactionError);
      } else if (transactionData) {
        console.log("Transaction data:", transactionData);
        setTransactions(transactionData);
      }
    };

    fetchData();
  }, []);

  if (!wallet) return null;

  const level = Math.floor((wallet.total_earned || 0) / 100) + 1;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20 animate-glow"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-medium">{wallet.balance} eaniara</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your eaniara Wallet</SheetTitle>
              <SheetDescription>
                View your transaction history and wallet stats
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">{wallet.total_earned}</p>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{wallet.total_spent}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Transaction History</h3>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), 'PPp')}
                        </p>
                      </div>
                      <p className={`font-medium ${
                        transaction.transaction_type === 'credit' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </SheetContent>
        </Sheet>

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