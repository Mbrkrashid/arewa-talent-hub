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
        
        // First, get all vendors
        const { data: vendors, error: vendorsError } = await supabase
          .from('vendors')
          .select('id, business_name');

        if (vendorsError) throw vendorsError;

        // Then get videos and join with vendors data in memory
        const { data: videoData, error: videoError } = await supabase
          .from('video_content')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (videoError) throw videoError;

        console.log('Successfully fetched videos:', videoData);

        // Combine videos with vendor data
        const videosWithVendors = videoData.map(video => ({
          ...video,
          level: Math.floor((video.likes_count || 0) / 100) + 1,
          vendors: vendors.find(v => v.id === video.vendor_id) || { business_name: "Anonymous" }
        }));

        setVideos(videosWithVendors);
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