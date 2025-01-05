import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Gamepad2, Trophy, Star, Music2, Mic, Sparkles, Heart, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface AuthUIProps {
  authError: string | null;
}

export const AuthUI = ({ authError }: AuthUIProps) => {
  const { toast } = useToast();
  const [loginError, setLoginError] = useState<string | null>(authError);
  const [isParticipant, setIsParticipant] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  
  const animations = [
    { icon: Mic, color: "text-primary" },
    { icon: Music2, color: "text-secondary" },
    { icon: Star, color: "text-yellow-500" },
    { icon: Heart, color: "text-pink-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const siteUrl = window.location.origin;
  console.log("Current site URL for redirect:", siteUrl);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        setLoginError(null);
      }
      
      if (loginError) {
        console.error("Authentication error:", loginError);
        toast({
          title: "Authentication Error",
          description: loginError,
          variant: "destructive",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, loginError]);

  const CurrentIcon = animations[currentAnimation].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-black to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8">
            <div className="relative flex items-center justify-center gap-4 animate-float">
              <div className="absolute -top-4 -left-4">
                <CurrentIcon className={`h-16 w-16 ${animations[currentAnimation].color} animate-pulse`} />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
                Arewa <br className="md:hidden" />
                Talent Hub
              </h1>
            </div>
            
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                Win Amazing Prizes!
              </h2>
              <div className="space-y-2">
                <p className="text-xl text-primary">🏆 1st Prize: ₦2,000,000</p>
                <p className="text-lg text-secondary">🥈 2nd Prize: ₦1,000,000</p>
                <p className="text-lg text-accent">🥉 3rd Prize: ₦500,000</p>
                <p className="text-sm text-gray-400">Plus additional rewards for most viewed talents!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
                <Trophy className="h-12 w-12 text-primary mb-4 group-hover:animate-bounce mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2 text-center">For Participants</h3>
                <p className="text-gray-400 text-sm text-center">Showcase your talent and compete for amazing prizes</p>
              </Card>
              
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
                <Award className="h-12 w-12 text-yellow-500 mb-4 group-hover:animate-pulse mx-auto" />
                <h3 className="text-lg font-semibold text-white mb-2 text-center">For Voters</h3>
                <p className="text-gray-400 text-sm text-center">Vote for your favorite talents and earn rewards</p>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg filter blur-xl animate-pulse"></div>
            <Card className="relative bg-black/80 backdrop-blur-lg border-primary/20 p-8 rounded-lg shadow-2xl animate-float">
              <div className="mb-6 space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  {isParticipant ? "Join as Participant" : "Join as Voter"}
                </h2>
                <p className="text-gray-400">
                  {isParticipant 
                    ? "Create an account to showcase your talent" 
                    : "Create an account to vote and earn rewards"}
                </p>
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
                        inputBackground: 'rgba(0,0,0,0.2)',
                        inputText: 'white',
                        inputPlaceholder: 'rgba(255,255,255,0.4)',
                      },
                    },
                  },
                  className: {
                    button: 'bg-primary hover:bg-primary/90 text-white transition-all duration-300',
                    input: 'bg-black/20 border-primary/20 text-white focus:ring-primary/50',
                    label: 'text-gray-300',
                    anchor: 'text-primary hover:text-primary/80 transition-colors',
                  },
                }}
                providers={["google"]}
                redirectTo={`${siteUrl}/`}
                view="sign_up"
                localization={{
                  variables: {
                    sign_up: {
                      button_label: isParticipant ? 'Sign up as Participant' : 'Sign up as Voter',
                      loading_button_label: 'Signing up...',
                      social_provider_text: 'Continue with {{provider}}',
                      link_text: 'Already have an account? Sign in',
                    },
                    sign_in: {
                      button_label: 'Sign in',
                      loading_button_label: 'Signing in...',
                      social_provider_text: 'Continue with {{provider}}',
                      link_text: "Don't have an account? Sign up",
                    },
                  },
                }}
              />

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsParticipant(!isParticipant)}
                  className="text-primary hover:text-primary/80 text-sm transition-colors underline"
                >
                  {isParticipant 
                    ? "Want to vote instead? Sign up as a voter" 
                    : "Want to participate? Sign up as a talent"}
                </button>
              </div>

              {(loginError || authError) && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500 text-center">
                    {loginError || authError}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};