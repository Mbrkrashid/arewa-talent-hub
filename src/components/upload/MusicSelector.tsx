import { useState, useEffect } from "react";
import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundMusic {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
}

interface MusicSelectorProps {
  selectedMusic: string | null;
  onMusicSelect: (musicId: string) => void;
}

export const MusicSelector = ({ selectedMusic, onMusicSelect }: MusicSelectorProps) => {
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<BackgroundMusic[]>([]);

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
    onMusicSelect(musicId);
    setShowMusicPicker(false);
  };

  return (
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
  );
};