import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface JudgeProfileCardProps {
  name: string;
  expertise: string;
  bio: string;
  avatarUrl?: string;
  rating?: number;
}

export const JudgeProfileCard = ({
  name,
  expertise,
  bio,
  avatarUrl,
  rating = 0,
}: JudgeProfileCardProps) => {
  return (
    <Card className="p-6 bg-black/20 border-primary/20 hover:border-primary/40 transition-colors">
      <div className="flex items-start space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white/90">{name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-white/60">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-primary/80 mt-1">{expertise}</p>
          <p className="text-sm text-white/60 mt-2">{bio}</p>
        </div>
      </div>
    </Card>
  );
};