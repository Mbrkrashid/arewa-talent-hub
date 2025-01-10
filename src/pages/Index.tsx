import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { RoleAuthUI } from "@/components/auth/RoleAuthUI";
import { Session } from "@supabase/supabase-js";
import type { Video } from "@/services/videoService";
import { fetchVideos } from "@/services/videoService";
import { SimpleVideoUpload } from "@/components/upload/SimpleVideoUpload";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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
          description: "You've successfully signed in",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchVideos();
        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Error",
          description: "Failed to load videos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [toast]);

  if (!session) {
    return <RoleAuthUI authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SimpleVideoUpload />
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Latest Videos</h2>
          <VideoGrid videos={videos} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Index;