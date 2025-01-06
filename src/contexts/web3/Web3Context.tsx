import { createContext, useContext, useEffect, useState } from 'react';
import { useTelegram } from '../telegram/TelegramContext';
import { useToast } from '@/hooks/use-toast';
import Web3 from 'web3';

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const { isTelegram } = useTelegram();
  const { toast } = useToast();

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask browser extension",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const newWeb3 = new Web3(window.ethereum);
      setWeb3(newWeb3);
      setAccount(accounts[0]);
      console.log("Wallet connected:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    if (!isTelegram && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }

    return () => {
      if (!isTelegram && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [isTelegram]);

  return (
    <Web3Context.Provider value={{ web3, account, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);