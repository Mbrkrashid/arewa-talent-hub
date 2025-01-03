import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Video, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RoleAuthUI = ({ authError }: { authError: any }) => {
  const [selectedRole, setSelectedRole] = useState<'participant' | 'voter' | null>(null);
  const { toast } = useToast();
  
  // Get the current site URL for redirect
  const siteUrl = window.location.origin;
  console.log("Current site URL for redirect:", siteUrl);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/71c04352-12a7-46c9-a740-c9871f0bc04c.png" 
            alt="Arewa Talent Hub" 
            className="mx-auto h-32 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome to Arewa Talent Hub</h2>
          <p className="mt-2 text-sm text-gray-400">
            {selectedRole ? `Sign in as a ${selectedRole}` : 'Choose your role to continue'}
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              size="lg"
              className="h-32 bg-primary/20 hover:bg-primary/30 transition-all"
              onClick={() => setSelectedRole('participant')}
            >
              <div className="text-center space-y-2">
                <Video className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">Participant</h3>
                <p className="text-sm text-gray-400">Showcase your talent</p>
              </div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-32 bg-primary/20 hover:bg-primary/30 transition-all"
              onClick={() => setSelectedRole('voter')}
            >
              <div className="text-center space-y-2">
                <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                <h3 className="text-lg font-semibold">Voter</h3>
                <p className="text-sm text-gray-400">Support talents</p>
              </div>
            </Button>
          </div>
        ) : (
          <Card className="p-6 bg-black/20 border-primary/20">
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#22c55e',
                      brandAccent: '#16a34a',
                    },
                  },
                },
              }}
              providers={['google']}
              redirectTo={`${siteUrl}/`}
              onlyThirdPartyProviders={false}
              view="sign_up"
              localization={{
                variables: {
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create a Password',
                    email_input_placeholder: 'Your email address',
                    password_input_placeholder: 'Your password',
                    button_label: `Sign up as ${selectedRole}`,
                    loading_button_label: 'Signing up ...',
                    social_provider_text: 'Continue with {{provider}}',
                    link_text: 'Already have an account? Sign in',
                  },
                  sign_in: {
                    email_label: 'Email address',
                    password_label: 'Your password',
                    email_input_placeholder: 'Your email address',
                    password_input_placeholder: 'Your password',
                    button_label: 'Sign in',
                    loading_button_label: 'Signing in ...',
                    social_provider_text: 'Continue with {{provider}}',
                    link_text: "Don't have an account? Sign up",
                  },
                },
              }}
            />
            {authError && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                {authError}
              </div>
            )}
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setSelectedRole(null)}
            >
              Choose Different Role
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};