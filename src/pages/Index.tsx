import { VideoCard } from "@/components/VideoCard";
import { Leaderboard } from "@/components/Leaderboard";
import { TokenBalance } from "@/components/TokenBalance";
import { Button } from "@/components/ui/button";
import { Upload, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { SponsoredAds } from "@/components/SponsoredAds";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleVote = () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote",
      });
      return;
    }
    
    toast({
      title: "Vote Recorded! 🎉",
      description: "You've used 1 token to vote for this talent. Keep supporting!",
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-black/50 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Gamepad2 className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Win ₦2,000,000!</h2>
            <p className="text-gray-400">Join the biggest talent hunt in Northern Nigeria</p>
          </div>
          <Auth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7C3AED',
                    brandAccent: '#6D28D9',
                  },
                },
              },
            }}
            providers={[]}
            onError={(error) => {
              console.error('Auth error:', error);
              toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive",
              });
            }}
          />
          {authError && (
            <p className="mt-4 text-sm text-red-500 text-center">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  const mockVideos = [
    {
      id: 1,
      title: "Traditional Dance Performance",
      artist: "Amina Ibrahim",
      votes: 1234,
      thumbnailUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500",
    },
    {
      id: 2,
      title: "Hausa Folk Song",
      artist: "Musa Abdullahi",
      votes: 982,
      thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
    },
    {
      id: 3,
      title: "Comedy Skit",
      artist: "Yakubu Mohammed",
      votes: 879,
      thumbnailUrl: "https://images.unsplash.com/photo-1525331336235-d3153d8e0de4?w=500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20">
      <header className="border-b border-primary/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Arewa Talent Hub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <TokenBalance />
              <Button 
                className="bg-primary hover:bg-primary/90 animate-pulse"
                onClick={() => navigate("/upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Share Your Talent
              </Button>
              <Button
                variant="outline"
                className="border-primary/20"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SponsoredAds />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Featured Talents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  artist={video.artist}
                  votes={video.votes}
                  thumbnailUrl={video.thumbnailUrl}
                  onVote={handleVote}
                />
              ))}
            </div>
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;