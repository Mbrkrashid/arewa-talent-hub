import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

export const WalletConnect = () => {
  const { account, connectWallet, disconnectWallet, isTelegram } = useWeb3();

  if (isTelegram) {
    return null; // Hide wallet connect button in Telegram WebApp
  }

  return (
    <Button
      variant="outline"
      className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20"
      onClick={account ? disconnectWallet : connectWallet}
    >
      <Wallet className="h-4 w-4 mr-2 text-primary" />
      {account ? "Disconnect Wallet" : "Connect Wallet"}
    </Button>
  );
};