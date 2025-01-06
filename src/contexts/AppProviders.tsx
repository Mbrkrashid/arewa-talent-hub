import { TelegramProvider } from './telegram/TelegramContext';
import { Web3Provider } from './web3/Web3Context';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TelegramProvider>
      <Web3Provider>
        {children}
      </Web3Provider>
    </TelegramProvider>
  );
};