import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import WebApp from '@twa-dev/sdk';
import { useWeb3 } from "@/contexts/Web3Context";
import Index from './pages/Index';

const App = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const { isTelegram } = useWeb3();

  useEffect(() => {
    if (isTelegram) {
      // Initialize Telegram WebApp
      WebApp.ready();
      console.log("Telegram WebApp initialized");
      
      // Handle Telegram user authentication
      const telegramUser = WebApp.initDataUnsafe.user;
      if (telegramUser) {
        console.log("Telegram user:", telegramUser);
      }
    }

    console.log("Setting up auth state change listener");
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, isTelegram]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  );
};

export default App;