import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import type { Video } from "@/services/videoService";

export const VideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
        console.log("Video in view:", currentIndex);
      }
    },
  });

  useEffect(() => {
    const fetchVideos = async () => {
      console.log('Fetching videos from Supabase...');
      try {
        const { data, error } = await supabase
          .from('video_content')
          .select(`
            id,
            title,
            thumbnail_url,
            likes_count,
            vendor_id,
            vendors:vendors (
              business_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching videos:', error);
          return;
        }

        console.log('Successfully fetched videos:', data);
        const transformedVideos = data?.map(video => ({
          ...video,
          level: Math.floor((video.likes_count || 0) / 100) + 1,
          vendors: video.vendors || { business_name: "Anonymous" }
        })) as Video[];
        
        setVideos(transformedVideos);
      } catch (error) {
        console.error('Unexpected error in fetchVideos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="snap-y snap-mandatory h-[calc(100vh-200px)] overflow-y-scroll">
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={index === currentIndex ? ref : undefined}
          className="snap-start h-full flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md">
            <VideoCard
              id={video.id}
              title={video.title}
              artist={video.vendors?.business_name || "Anonymous"}
              votes={video.likes_count}
              thumbnailUrl={video.thumbnail_url || "/placeholder.svg"}
              level={Math.floor((video.likes_count || 0) / 100) + 1}
            />
          </div>
        </div>
      ))}
    </div>
  );
};