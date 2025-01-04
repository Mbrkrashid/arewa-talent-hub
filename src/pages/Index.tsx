import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleAuthUI } from "@/components/auth/RoleAuthUI";
import { SponsoredAds } from "@/components/SponsoredAds";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import type { Video } from "@/services/videoService";
import { AuthError, Session } from "@supabase/supabase-js";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Current session:", session);
        if (error) throw error;
        setSession(session);
      } catch (err) {
        console.error("Error checking session:", err);
        setError("Failed to check authentication status");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        setAuthError(null);
        
        // Create or update profile with role
        if (session?.user) {
          try {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                role: session.user.user_metadata.role || 'voter',
                updated_at: new Date().toISOString(),
              });

            if (error) throw error;

            toast({
              title: "Welcome! 🎉",
              description: "Successfully signed in",
            });
          } catch (err) {
            console.error('Error updating profile:', err);
            toast({
              title: "Profile Error",
              description: "Failed to update profile. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return <RoleAuthUI authError={authError} />;
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