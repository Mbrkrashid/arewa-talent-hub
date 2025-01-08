import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Youtube, Facebook, MessageCircle, Instagram } from "lucide-react";
import { connectSocialMedia, getSocialMediaConnections, type SocialMediaConnection } from "@/services/socialMediaService";

export const SocialMediaConnections = () => {
  const [connections, setConnections] = useState<SocialMediaConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await getSocialMediaConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleConnect = async (platform: SocialMediaConnection['platform']) => {
    try {
      setLoading(true);
      await connectSocialMedia(platform);
      await loadConnections();
      toast({
        title: "Connected!",
        description: `Successfully connected to ${platform}`,
      });
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${platform}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'telegram':
        return <MessageCircle className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {['youtube', 'facebook', 'telegram', 'instagram'].map((platform) => {
        const connection = connections.find(c => c.platform === platform);
        return (
          <Button
            key={platform}
            variant={connection?.isConnected ? "default" : "outline"}
            className="flex items-center gap-2 capitalize"
            onClick={() => handleConnect(platform as SocialMediaConnection['platform'])}
            disabled={loading}
          >
            {getPlatformIcon(platform)}
            {platform}
          </Button>
        );
      })}
    </div>
  );
};