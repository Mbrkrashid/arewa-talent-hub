import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, Award } from "lucide-react";

type ScoringCriteria = {
  creativity: number;
  skill: number;
  performance: number;
};

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  vendor_id: string;
  vendors: {
    business_name: string;
  };
}

export const JudgesDashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [scores, setScores] = useState<ScoringCriteria>({
    creativity: 0,
    skill: 0,
    performance: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleScore = async (videoId: string) => {
    try {
      const { data: judge } = await supabase
        .from("judges")
        .select("id")
        .eq("profile_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!judge) {
        toast({
          title: "Error",
          description: "You must be a judge to score videos",
          variant: "destructive",
        });
        return;
      }

      // Convert scores to a plain object that matches the database JSON structure
      const reviewData = {
        judge_id: judge.id,
        video_id: videoId,
        scores: scores as Record<string, number>,
        feedback,
      };

      const { error } = await supabase
        .from("judge_reviews")
        .insert(reviewData);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already reviewed",
            description: "You have already reviewed this video",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Your review has been submitted",
      });

      setScores({ creativity: 0, skill: 0, performance: 0 });
      setFeedback("");
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white/90">Judge Dashboard</h2>
        <Button variant="outline" className="gap-2">
          <Award className="h-4 w-4" />
          Judge Panel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden bg-black/50 border-primary/20">
            <div className="relative aspect-video">
              <img
                src={video.thumbnail_url || "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-white/90">{video.title}</h3>
                <p className="text-sm text-white/60">{video.vendors?.business_name}</p>
              </div>

              {selectedVideo === video.id && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(scores).map(([criterion, score]) => (
                      <div key={criterion} className="flex items-center gap-2">
                        <label className="text-sm capitalize text-white/80">{criterion}</label>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={score}
                            onChange={(e) =>
                              setScores((prev) => ({
                                ...prev,
                                [criterion]: parseInt(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-white/80">{score}/10</span>
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback..."
                    className="w-full p-2 rounded bg-black/30 text-white/90 border border-white/10"
                    rows={3}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedVideo(null);
                        setScores({ creativity: 0, skill: 0, performance: 0 });
                        setFeedback("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => handleScore(video.id)}>Submit Review</Button>
                  </div>
                </div>
              )}

              {selectedVideo !== video.id && (
                <Button
                  className="w-full gap-2"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <Star className="h-4 w-4" />
                  Score Performance
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};