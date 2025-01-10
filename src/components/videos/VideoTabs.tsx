import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoScroll } from "@/components/VideoScroll";
import { Video } from "@/services/videoService";

interface VideoTabsProps {
  videos: Video[];
  loading: boolean;
}

export const VideoTabs = ({ videos, loading }: VideoTabsProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-white/80">Loading amazing talents...</div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="foryou" className="h-full">
      <TabsList className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
        <TabsTrigger 
          value="foryou" 
          className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-6"
        >
          For You
        </TabsTrigger>
        <TabsTrigger 
          value="following" 
          className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-6"
        >
          Following
        </TabsTrigger>
      </TabsList>

      <TabsContent value="foryou" className="h-full m-0 outline-none">
        <VideoScroll videos={videos} loading={loading} />
      </TabsContent>
      
      <TabsContent value="following" className="h-full m-0 outline-none">
        <VideoScroll 
          videos={videos.filter(video => video.isFollowing)} 
          loading={loading} 
        />
      </TabsContent>
    </Tabs>
  );
};