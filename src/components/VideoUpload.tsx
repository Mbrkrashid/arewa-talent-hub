import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadHeader } from "./upload/UploadHeader";
import { MusicSelector } from "./upload/MusicSelector";
import { UploadProgress } from "./upload/UploadProgress";
import { UploadActions } from "./upload/UploadActions";

export const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setProgress(0);
      const file = event.target.files?.[0];
      
      if (!file) return;

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        });
        return;
      }

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

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data: storageData } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      let musicUrl = null;
      let musicTitle = null;
      if (selectedMusic) {
        const { data: musicData } = await supabase
          .from('background_music')
          .select('audio_url, title')
          .eq('id', selectedMusic)
          .single();
          
        if (musicData) {
          musicUrl = musicData.audio_url;
          musicTitle = musicData.title;
        }
      }

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
          social_media_source: null
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your video has been uploaded",
      });

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

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-black/50">
      <UploadHeader />
      
      <MusicSelector 
        selectedMusic={selectedMusic}
        onMusicSelect={setSelectedMusic}
      />

      <UploadProgress 
        progress={progress}
        uploading={uploading}
      />

      <UploadActions 
        uploading={uploading}
        onFileInputClick={handleFileInputClick}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
};