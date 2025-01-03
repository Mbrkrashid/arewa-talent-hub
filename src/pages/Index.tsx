import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoleAuthUI } from "@/components/auth/RoleAuthUI";
import { SponsoredAds } from "@/components/SponsoredAds";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { fetchVideos } from "@/services/videoService";
import type { Video } from "@/services/videoService";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      setSession(session);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (_event === 'SIGNED_IN') {
        setAuthError(null);
        
        // Create or update profile with role
        if (session?.user) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              role: session.user.user_metadata.role || 'voter',
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error updating profile:', error);
            toast({
              title: "Profile Error",
              description: "Failed to update profile. Please try again.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
      
      if (_event === 'SIGNED_OUT') {
        setAuthError(null);
        toast({
          title: "Goodbye! 👋",
          description: "Successfully signed out",
        });
      }
      
      if (_event === 'USER_DELETED') {
        setSession(null);
        setAuthError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  useEffect(() => {
    const loadVideos = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const { data, error } = await fetchVideos();
        
        if (error) {
          console.error('Error in loadVideos:', error);
          toast({
            title: "Error",
            description: "Failed to load videos. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setVideos(data);
        }
      } catch (error) {
        console.error('Error in loadVideos:', error);
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [session, toast]);

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