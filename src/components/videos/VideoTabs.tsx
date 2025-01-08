import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoScroll } from "@/components/VideoScroll";

interface VideoTabsProps {
  videos: any[];
  loading: boolean;
}

export const VideoTabs = ({ videos, loading }: VideoTabsProps) => {
  return (
    <Tabs defaultValue="foryou" className="w-full">
      <TabsList className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-transparent">
        <TabsTrigger value="foryou" className="text-white">For You</TabsTrigger>
        <TabsTrigger value="following" className="text-white">Following</TabsTrigger>
      </TabsList>

      <TabsContent value="foryou" className="h-full">
        <VideoScroll videos={videos} loading={loading} />
      </TabsContent>
      
      <TabsContent value="following" className="h-full">
        <VideoScroll 
          videos={videos.filter(video => video.isFollowing)} 
          loading={loading} 
        />
      </TabsContent>
    </Tabs>
  );
};