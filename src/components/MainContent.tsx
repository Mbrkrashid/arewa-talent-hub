import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoScroll } from "@/components/VideoScroll";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Music2, Trophy, Bell, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaderboard } from "@/components/Leaderboard";
import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Badge } from "@/components/ui/badge";

interface MainContentProps {
  videos: any[];
  loading: boolean;
}

export const MainContent = ({ videos, loading }: MainContentProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [participantLevel, setParticipantLevel] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, total_votes, participant_level')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
          setTotalVotes(profile.total_votes || 0);
          setParticipantLevel(profile.participant_level || 1);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLike = async (videoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like videos",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('video_likes')
        .insert({ video_id: videoId, user_id: user.id });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Video liked successfully",
      });
    } catch (error) {
      console.error('Error liking video:', error);
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    }
  };

  const handleFollow = async (participantId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to follow participants",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('vendor_followers')
        .insert({ vendor_id: participantId, follower_id: user.id });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Now following participant",
      });
    } catch (error) {
      console.error('Error following participant:', error);
      toast({
        title: "Error",
        description: "Failed to follow participant",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        {userRole === 'participant' && (
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = '/upload'}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full"
        >
          <Bell className="h-6 w-6" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>
      </div>

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
      
      {/* Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
          onClick={() => handleLike(videos[currentVideoIndex]?.id)}
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <Share2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
          onClick={() => handleFollow(videos[currentVideoIndex]?.vendor_id)}
        >
          <UserPlus className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
        >
          <Music2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Gamification Elements */}
      <div className="absolute left-4 bottom-20 w-72">
        <ParticipantLevel level={participantLevel} totalVotes={totalVotes} />
      </div>

      {/* Leaderboard */}
      <div className="absolute left-4 top-20 w-72">
        <Leaderboard />
      </div>
    </div>
  );
};