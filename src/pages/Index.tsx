import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Diamond, Users, Trophy, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Video } from "@/services/videoService";
import { Session } from "@supabase/supabase-js";
import { TokenBalance } from "@/components/TokenBalance";
import { JudgesOverlay } from "@/components/judges/JudgesOverlay";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

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
          title: "Welcome to Arewa Talent Hub! 🎉",
          description: "Start exploring amazing talents",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="bg-[#2b2d31]/50 border-none p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Arewa Talent Hub</h2>
              <p className="text-gray-400">Northern Nigeria's biggest talent competition</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-[#1a1b1e] rounded-lg p-4 text-center">
              <Diamond className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <TokenBalance />
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

        {/* Main Content with Videos */}
        <MainContent videos={videos} loading={loading} />

        {/* Judges Overlay */}
        <JudgesOverlay videoId="current-video-id" />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1b1e] border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <Diamond className="h-5 w-5 text-blue-400" />
              <span className="text-xs text-gray-400">Exchange</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <Wallet className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400">Wallet</span>
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
    </div>
  );
};

export default Index;