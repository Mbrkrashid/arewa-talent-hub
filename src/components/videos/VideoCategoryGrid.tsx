import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Music2, Laugh } from "lucide-react";
import type { Video } from "@/services/videoService";

interface Category {
  id: string;
  label: string;
  icon: any;
}

const categories = [
  { id: 'singing', label: 'Singing Competition', icon: Mic },
  { id: 'dancing', label: 'Dancing Competition', icon: Music2 },
  { id: 'comedy', label: 'Comedy Skits', icon: Laugh },
];

export const VideoCategoryGrid = () => {
  const [videosByCategory, setVideosByCategory] = useState<Record<string, Video[]>>({});

  useEffect(() => {
    const fetchVideos = async () => {
      console.log('Fetching videos by category...');
      try {
        const { data, error } = await supabase
          .from('video_content')
          .select(`
            id,
            title,
            thumbnail_url,
            likes_count,
            views_count,
            category_id,
            vendors!inner (
              business_name
            )
          `)
          .order('views_count', { ascending: false });

        if (error) {
          console.error('Error fetching videos:', error);
          return;
        }

        console.log('Fetched category videos:', data);
        const transformedData = data?.map(video => ({
          ...video,
          vendors: video.vendors || { business_name: "Anonymous" }
        })) as Video[];

        const grouped = transformedData.reduce((acc, video) => {
          const category = video.category_id || 'uncategorized';
          acc[category] = [...(acc[category] || []), video];
          return acc;
        }, {} as Record<string, Video[]>);
        
        setVideosByCategory(grouped);
      } catch (error) {
        console.error('Error in fetchVideos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6 text-white/90">Competition Categories</h2>
      <Tabs defaultValue={categories[0].id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(videosByCategory[category.id] || []).map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  artist={video.vendors?.business_name || "Anonymous"}
                  votes={video.likes_count}
                  thumbnailUrl={video.thumbnail_url || "/placeholder.svg"}
                  level={Math.floor((video.likes_count || 0) / 100) + 1}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};