import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export const WalletConnect = () => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: accounts[0] })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Wallet connected!",
        description: "Your crypto wallet has been successfully linked",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20"
      onClick={connectWallet}
      disabled={connecting}
    >
      <Wallet className="h-4 w-4 mr-2 text-primary" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};