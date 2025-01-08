import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Index from './pages/Index';

const App = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
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
  }, [toast]);

  return (
    <div className="min-h-screen min-w-screen bg-black text-white overflow-hidden">
      <div className="mx-auto h-full w-full max-w-[480px] lg:max-w-none relative">
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;