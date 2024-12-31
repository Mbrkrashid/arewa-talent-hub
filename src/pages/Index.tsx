import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthUI } from "@/components/AuthUI";
import { SponsoredAds } from "@/components/SponsoredAds";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });
      }
      if (_event === 'SIGNED_OUT') {
        toast({
          title: "Goodbye! 👋",
          description: "Successfully signed out",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching videos from Supabase...');
        const { data, error } = await supabase
          .from('video_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching videos:', error);
          throw error;
        }
        
        console.log('Successfully fetched videos:', data);
        
        const videosWithLevel = data?.map(video => ({
          ...video,
          level: Math.floor((video.likes_count || 0) / 100) + 1,
          vendors: { business_name: "Anonymous" }
        })) || [];
        
        setVideos(videosWithLevel);
      } catch (error) {
        console.error('Error in fetchVideos:', error);
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [toast]);

  if (!session) {
    return <AuthUI authError={authError} />;
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