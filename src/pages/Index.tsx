import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthUI } from "@/components/AuthUI";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Diamond, Users, Trophy, Gamepad, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Video } from "@/services/videoService";
import { Session } from "@supabase/supabase-js";
import WebApp from '@twa-dev/sdk';
import { useWeb3 } from "@/contexts/Web3Context";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTelegram } = useWeb3();

  useEffect(() => {
    if (isTelegram) {
      WebApp.ready();
      console.log("Telegram WebApp initialized");
      
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
        setAuthError(null);
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, isTelegram]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#2b2d31]">
        <Header />
        
        {/* Profile Section */}
        <div className="container mx-auto px-4 py-6">
          <Card className="bg-[#2b2d31]/50 border-none p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Arewa Talent Hub</h2>
                <p className="text-gray-400">Join Northern Nigeria's biggest talent competition</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-[#1a1b1e] rounded-lg p-4 text-center">
                <Diamond className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <span className="text-lg font-bold text-white">19.2</span>
                <p className="text-sm text-gray-400">Tokens</p>
              </div>
              <div className="bg-[#1a1b1e] rounded-lg p-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <span className="text-lg font-bold text-white">Level 5</span>
                <p className="text-sm text-gray-400">Rank</p>
              </div>
              <div className="bg-[#1a1b1e] rounded-lg p-4 text-center">
                <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <span className="text-lg font-bold text-white">1.2K</span>
                <p className="text-sm text-gray-400">Friends</p>
              </div>
            </div>
          </Card>
        </div>

        {/* New Today Section */}
        <div className="container mx-auto px-4 py-6">
          <h3 className="text-lg font-semibold text-white mb-4">New Today</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-[#2b2d31]/50 border-none overflow-hidden">
                <div className="aspect-square relative">
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                  <img 
                    src={`/placeholder.svg`}
                    alt="Talent"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-white text-sm">0/40</span>
                    <Diamond className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1b1e] border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-around py-4">
              <Button variant="ghost" className="flex flex-col items-center gap-1">
                <Diamond className="h-5 w-5 text-blue-400" />
                <span className="text-xs text-gray-400">Exchange</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center gap-1">
                <Gamepad className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-400">Playground</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center gap-1">
                <Share2 className="h-5 w-5 text-yellow-400" />
                <span className="text-xs text-gray-400">AirDrop</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center gap-1">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-400">Friends</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center gap-1">
                <Diamond className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-400">Earn</span>
              </Button>
            </div>
          </div>
        </div>

        <AuthUI authError={authError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MainContent videos={videos} loading={loading} />
      </main>
    </div>
  );
};

export default Index;