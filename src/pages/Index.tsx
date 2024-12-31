import { VideoCard } from "@/components/VideoCard";
import { Leaderboard } from "@/components/Leaderboard";
import { TokenBalance } from "@/components/TokenBalance";
import { SponsoredAds } from "@/components/SponsoredAds";
import { VideoUpload } from "@/components/VideoUpload";
import { AuthUI } from "@/components/AuthUI";
import { Button } from "@/components/ui/button";
import { Upload, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  vendor_id: string;
  vendor: {
    business_name: string;
  };
  level?: number;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [videos, setVideos] = useState<Video[]>([]);
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
        console.log('Fetching videos...');
        const { data, error } = await supabase
          .from('video_content')
          .select(`
            id,
            title,
            thumbnail_url,
            likes_count,
            vendor_id,
            vendor:vendors (
              business_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching videos:', error);
          throw error;
        }
        
        console.log('Fetched videos:', data);
        
        // Transform the data to include the level calculation
        const videosWithLevel = data?.map(video => ({
          ...video,
          level: Math.floor((video.likes_count || 0) / 100) + 1
        })) || [];
        
        setVideos(videosWithLevel);
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
    return <AuthUI authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary/20">
      <header className="border-b border-primary/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Arewa Talent Hub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <TokenBalance />
              <Button 
                className="bg-primary hover:bg-primary/90 animate-pulse"
                onClick={() => navigate("/upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Share Your Talent
              </Button>
              <Button
                variant="outline"
                className="border-primary/20"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SponsoredAds />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <VideoUpload />
            </div>
            <h2 className="text-xl font-semibold mb-6 text-white/90">Featured Talents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 text-center py-12 text-gray-400">
                  Loading talents...
                </div>
              ) : videos.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-400">
                  No videos uploaded yet. Be the first to share your talent!
                </div>
              ) : (
                videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    artist={video.vendor?.business_name || "Anonymous"}
                    votes={video.likes_count}
                    thumbnailUrl={video.thumbnail_url || "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500"}
                    level={video.level || 1}
                  />
                ))
              )}
            </div>
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;