import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { RoleAuthUI } from "@/components/auth/RoleAuthUI";
import { Session } from "@supabase/supabase-js";
import type { Video } from "@/services/videoService";

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
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log("Fetching videos from database...");
        
        const { data, error } = await supabase
          .from('video_content')
          .select(`
            id,
            title,
            description,
            video_url,
            thumbnail_url,
            views_count,
            likes_count,
            shares_count,
            created_at,
            updated_at,
            vendor_id,
            vendors:vendor_id (
              business_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log("Fetched videos:", data);
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

    fetchVideos();
  }, [toast]);

  if (!session) {
    return <RoleAuthUI authError={authError} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Header />
      <MainContent videos={videos} loading={loading} />
    </div>
  );
};

export default Index;