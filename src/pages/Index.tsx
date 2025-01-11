import { VideoCard } from "@/components/VideoCard";
import { Leaderboard } from "@/components/Leaderboard";
import { TokenBalance } from "@/components/TokenBalance";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, Trophy, Timer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { PrizePool } from "@/components/PrizePool";
import { CountdownTimer } from "@/components/CountdownTimer";

const Index = () => {
  const { toast } = useToast();

  const handleVote = () => {
    toast({
      title: "Vote Recorded!",
      description: "You've used 1 token to vote for this talent.",
    });
  };

  const mockVideos = [
    {
      id: 1,
      title: "Amazing Dance Performance",
      artist: "Sarah Johnson",
      votes: 1234,
      thumbnailUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500",
    },
    {
      id: 2,
      title: "Acoustic Guitar Solo",
      artist: "Michael Chen",
      votes: 982,
      thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
    },
    {
      id: 3,
      title: "Stand-up Comedy",
      artist: "Emma Davis",
      votes: 879,
      thumbnailUrl: "https://images.unsplash.com/photo-1525331336235-d3153d8e0de4?w=500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
            <div className="flex items-center gap-4">
              <TokenBalance />
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Talent
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3 mb-4">
                  <Timer className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Competition Ends In</h2>
                </div>
                <CountdownTimer targetDate="2024-04-01" />
              </Card>
              <PrizePool />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Talents
                </h2>
                <Button variant="outline" className="text-primary">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    title={video.title}
                    artist={video.artist}
                    votes={video.votes}
                    thumbnailUrl={video.thumbnailUrl}
                    onVote={handleVote}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;