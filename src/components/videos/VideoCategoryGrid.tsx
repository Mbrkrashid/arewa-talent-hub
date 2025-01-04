import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  category_id: string;
  vendors: {
    business_name: string;
  };
}

const categories = [
  { id: 'singing', label: 'Hausa Singer' },
  { id: 'hiphop', label: 'Hausa Hip-hop' },
  { id: 'skit', label: 'Hausa Skits' },
  { id: 'dancing', label: 'Hausa Dancing' },
];

export const VideoCategoryGrid = () => {
  const [videosByCategory, setVideosByCategory] = useState<Record<string, Video[]>>({});

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('video_content')
        .select(`
          id,
          title,
          thumbnail_url,
          likes_count,
          category_id,
          vendors (
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Group videos by category
        const grouped = data.reduce((acc, video) => {
          const category = video.category_id || 'uncategorized';
          acc[category] = [...(acc[category] || []), video];
          return acc;
        }, {} as Record<string, Video[]>);
        
        setVideosByCategory(grouped);
        console.log("Fetched videos by category:", grouped);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6 text-white/90">Explore Categories</h2>
      <Tabs defaultValue={categories[0].id} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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