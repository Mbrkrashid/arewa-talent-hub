import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthUI } from "@/components/AuthUI";
import { SponsoredAds } from "@/components/SponsoredAds";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Gamepad2, Trophy, Star, Music2, Mic, Sparkles, Heart, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Video } from "@/services/videoService";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Mic,
      title: "Showcase Your Talent",
      description: "Upload your performances and share them with the world"
    },
    {
      icon: Trophy,
      title: "Win Big Prizes",
      description: "Compete for amazing cash prizes and recognition"
    },
    {
      icon: Star,
      title: "Get Discovered",
      description: "Reach a wider audience and gain followers"
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Connect with other talented performers"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
        setAuthError(null);
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-black to-secondary/20">
        <Header />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
              Unleash Your Talent
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Join Northern Nigeria's biggest talent competition and showcase your skills to the world
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16 bg-black/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 ${
                    index === currentFeature ? 'animate-pulse scale-105' : ''
                  }`}
                >
                  <Icon className="h-12 w-12 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-white text-center mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-center">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Prize Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2 justify-center">
              <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
              Win Amazing Prizes!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Trophy className="h-16 w-16 text-yellow-500 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-primary mb-2 text-center">1st Prize</h3>
                <p className="text-3xl font-bold text-white mb-2 text-center">₦2,000,000</p>
              </Card>
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Award className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-secondary mb-2 text-center">2nd Prize</h3>
                <p className="text-3xl font-bold text-white mb-2 text-center">₦1,000,000</p>
              </Card>
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Star className="h-16 w-16 text-yellow-700 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-accent mb-2 text-center">3rd Prize</h3>
                <p className="text-3xl font-bold text-white mb-2 text-center">₦500,000</p>
              </Card>
            </div>
            <p className="text-gray-400">Plus additional rewards for most viewed talents!</p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 py-16 bg-black/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Competition Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <Music2 className="h-16 w-16 text-primary mb-4 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Dancing Competition</h3>
              <p className="text-gray-400 text-center">Show off your best dance moves</p>
            </Card>
            <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <Mic className="h-16 w-16 text-secondary mb-4 mx-auto animate-pulse" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Singing Competition</h3>
              <p className="text-gray-400 text-center">Let your voice be heard</p>
            </Card>
            <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <Sparkles className="h-16 w-16 text-accent mb-4 mx-auto animate-spin" />
              <h3 className="text-xl font-bold text-white text-center mb-2">Comedy Skits</h3>
              <p className="text-gray-400 text-center">Make the audience laugh</p>
            </Card>
          </div>
        </div>

        <AuthUI authError={authError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SponsoredAds />
        <MainContent videos={videos} loading={loading} />
      </main>
    </div>
  );
};

export default Index;