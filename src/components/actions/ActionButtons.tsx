import { Button } from "@/components/ui/button";
import { Diamond, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TokenBalance } from "@/components/TokenBalance";

export const ActionButtons = () => {
  const { toast } = useToast();

  const handleInviteFriends = async () => {
    toast({
      title: "Share on Social Media",
      description: "Coming soon: Share on WhatsApp, Facebook, and Twitter!",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <TokenBalance />
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="bg-black/20 animate-pulse"
          onClick={handleInviteFriends}
        >
          <Share2 className="h-4 w-4 mr-2 text-primary" />
          Invite Friends
        </Button>
        <Button variant="outline" className="bg-black/20">
          <Diamond className="h-4 w-4 mr-2 text-primary animate-pulse" />
          Exchange
        </Button>
        <Button variant="outline" className="bg-black/20">
          <Star className="h-4 w-4 mr-2 text-yellow-500 animate-pulse" />
          Earn
        </Button>
      </div>
    </div>
  );
};