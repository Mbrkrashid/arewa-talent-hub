import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Award, Share2, Star } from "lucide-react";

interface VideoCardProps {
  title: string;
  artist: string;
  votes: number;
  thumbnailUrl: string;
  onVote: () => void;
}

export const VideoCard = ({ title, artist, votes, thumbnailUrl, onVote }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] duration-300 bg-black/50 border-primary/20">
      <div className="relative aspect-video group">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-white/80 text-sm">{artist}</p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-400">Level 5</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary animate-pulse"
            onClick={onVote}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-white">{votes} votes</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary">
            <Award className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};