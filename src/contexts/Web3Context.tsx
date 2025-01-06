import { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import WebApp from "@twa-dev/sdk";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  isTelegram: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  account: null,
  isTelegram: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if running in Telegram WebApp
    if (WebApp.isInitialized) {
      setIsTelegram(true);
      console.log("Running in Telegram WebApp", WebApp.initData);
    }

    // Initialize Web3
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!web3) {
        toast({
          title: "Web3 Not Available",
          description: "Please install MetaMask or use Telegram WebApp",
          variant: "destructive",
        });
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts[0]) {
        setAccount(accounts[0]);
        
        // Update user profile with wallet address
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({ wallet_address: accounts[0] })
            .eq('id', user.id);
        }

        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Web3 wallet",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Web3 wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Web3 wallet has been disconnected",
    });
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        isTelegram,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);