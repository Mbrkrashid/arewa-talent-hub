import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  vendor_id: string;
  vendors: {
    business_name: string;
  };
}

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
      const { data, error } = await supabase
        .from('video_content')
        .select(`
          id,
          title,
          thumbnail_url,
          likes_count,
          vendor_id,
          vendors (
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setVideos(data);
        console.log("Fetched videos:", data);
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