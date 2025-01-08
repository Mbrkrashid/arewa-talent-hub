import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto bg-black/80 backdrop-blur-lg border-primary/20 p-8 rounded-lg shadow-2xl">
        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Join TikTok Talent Hub
          </h2>
          <p className="text-gray-400">
            Create an account to showcase your talent
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
        />

        {(loginError || authError) && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500 text-center">
              {loginError || authError}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};