import { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramContextType {
  isTelegram: boolean;
  telegramUser: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegram: false,
  telegramUser: null,
});

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  useEffect(() => {
    if (WebApp && 'initData' in WebApp) {
      setIsTelegram(true);
      console.log("Running in Telegram WebApp", WebApp.initData);
      
      if (WebApp.initDataUnsafe?.user) {
        setTelegramUser(WebApp.initDataUnsafe.user);
        console.log("Telegram user:", WebApp.initDataUnsafe.user);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ isTelegram, telegramUser }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);