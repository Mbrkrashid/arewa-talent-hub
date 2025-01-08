import { useState, useEffect } from "react";
import { Upload, Video, Music2, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BackgroundMusic {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
}

export const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundMusic, setBackgroundMusic] = useState<BackgroundMusic[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackgroundMusic();
  }, []);

  const fetchBackgroundMusic = async () => {
    try {
      const { data, error } = await supabase
        .from('background_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackgroundMusic(data || []);
    } catch (error) {
      console.error('Error fetching background music:', error);
    }
  };

  const handleMusicSelect = (musicId: string) => {
    setSelectedMusic(musicId);
    setShowMusicPicker(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setProgress(0);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload videos",
          variant: "destructive",
        });
        return;
      }

      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'participant') {
        toast({
          title: "Access denied",
          description: "Only participants can upload videos",
          variant: "destructive",
        });
        return;
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data: storageData } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get video URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Get selected music details if any
      let musicUrl = null;
      let musicTitle = null;
      if (selectedMusic) {
        const selectedTrack = backgroundMusic.find(m => m.id === selectedMusic);
        if (selectedTrack) {
          musicUrl = selectedTrack.audio_url;
          musicTitle = selectedTrack.title;
        }
      }

      // Create video entry in database
      const { error: dbError } = await supabase
        .from('video_content')
        .insert({
          vendor_id: user.id,
          title: file.name.split('.')[0],
          video_url: publicUrl,
          thumbnail_url: publicUrl,
          description: "My talent showcase",
          music_url: musicUrl,
          music_title: musicTitle,
          social_media_source: null // Will be updated when shared to social platforms
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your video has been uploaded",
      });

      // Refresh the page to show the new video
      window.location.reload();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-black/50">
      <Video className="h-12 w-12 text-primary animate-pulse" />
      <h3 className="text-lg font-semibold text-white">Share Your Talent</h3>
      <p className="text-sm text-gray-400 text-center">
        Upload your video to participate in the talent show
      </p>

      <Dialog open={showMusicPicker} onOpenChange={setShowMusicPicker}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Music2 className="h-4 w-4" />
            {selectedMusic ? 'Change Music' : 'Add Background Music'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Background Music</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {backgroundMusic.map((track) => (
              <Button
                key={track.id}
                variant="outline"
                className="justify-start gap-2"
                onClick={() => handleMusicSelect(track.id)}
              >
                <Music2 className="h-4 w-4" />
                {track.title} - {track.artist}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {uploading && (
        <div className="w-full space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-400">{Math.round(progress)}%</p>
        </div>
      )}

      <div className="flex gap-4">
        <label htmlFor="video-upload">
          <Button 
            className="bg-primary hover:bg-primary/90"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </label>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Social media integration will be available soon!",
            });
          }}
        >
          <Youtube className="h-4 w-4" />
          Import from YouTube
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Social media integration will be available soon!",
            });
          }}
        >
          <Instagram className="h-4 w-4" />
          Import from Instagram
        </Button>
      </div>

      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
};