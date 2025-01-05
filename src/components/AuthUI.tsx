import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Gamepad2, Trophy, Star, Music2, Mic, Sparkles } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-black to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4 animate-float">
              <div className="relative">
                <Mic className="h-12 w-12 text-primary animate-pulse absolute -top-1 -left-1" />
                <Music2 className="h-12 w-12 text-secondary animate-dance" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
                Arewa Talent Hub
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                Win ₦2,000,000 in Prizes!
              </h2>
              <p className="text-xl text-gray-400">Join Northern Nigeria's biggest talent hunt competition</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Trophy className="h-8 w-8 text-primary mb-4 animate-bounce" />
                <h3 className="text-lg font-semibold text-white mb-2">For Participants</h3>
                <p className="text-gray-400 text-sm">Showcase your talent and compete for amazing prizes</p>
              </Card>
              
              <Card className="p-6 bg-black/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <Star className="h-8 w-8 text-yellow-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-white mb-2">For Voters</h3>
                <p className="text-gray-400 text-sm">Vote for your favorite talents and earn rewards</p>
              </Card>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-primary/20 p-8 animate-float">
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
                  button: 'bg-primary hover:bg-primary/90 text-white',
                  input: 'bg-black/20 border-primary/20 text-white',
                  label: 'text-gray-300',
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

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsParticipant(!isParticipant)}
                className="text-primary hover:text-primary/80 text-sm transition-colors"
              >
                {isParticipant 
                  ? "Want to vote instead? Sign up as a voter" 
                  : "Want to participate? Sign up as a talent"}
              </button>
            </div>

            {(loginError || authError) && (
              <p className="mt-4 text-sm text-red-500 text-center">
                {loginError || authError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};