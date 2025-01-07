import { Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type TokenWallet = Database['public']['Tables']['token_wallets']['Row'];

export const TokenBalance = () => {
  const [wallet, setWallet] = useState<TokenWallet | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: walletData, error } = await supabase
        .from('token_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && walletData) {
        setWallet(walletData);
        console.log("Wallet data:", walletData);
      }
    };

    fetchData();
  }, []);

  if (!wallet) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-[#2b2d31] hover:bg-[#2b2d31]/80"
          >
            <Diamond className="h-4 w-4 text-blue-400 mr-2" />
            <span className="font-medium text-white">{wallet.balance} eNaira</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your eNaira balance</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};