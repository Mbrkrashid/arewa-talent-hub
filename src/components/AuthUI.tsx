import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthUIProps {
  authError: string | null;
}

export const AuthUI = ({ authError }: AuthUIProps) => {
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
          redirectTo={window.location.origin.replace(/\/$/, '')}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
        {authError && (
          <p className="mt-4 text-sm text-red-500 text-center">{authError}</p>
        )}
      </div>
    </div>
  );
};