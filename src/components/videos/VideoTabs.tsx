import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoScroll } from "@/components/VideoScroll";

interface VideoTabsProps {
  videos: any[];
  loading: boolean;
}

export const VideoTabs = ({ videos, loading }: VideoTabsProps) => {
  return (
    <Tabs defaultValue="foryou" className="h-full">
      <TabsList className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-transparent border-none">
        <TabsTrigger 
          value="foryou" 
          className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-transparent"
        >
          For You
        </TabsTrigger>
        <TabsTrigger 
          value="following" 
          className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-transparent"
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