import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadToTikTok } from "@/services/tiktokService";
import { Upload, Loader2 } from "lucide-react";

export const SimpleVideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload videos",
          variant: "destructive",
        });
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data: storageData } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Upload to TikTok
      await uploadToTikTok({
        title,
        description,
        video_url: publicUrl,
      });

      // Save to Supabase database
      const { error: dbError } = await supabase
        .from('video_content')
        .insert({
          vendor_id: user.id,
          title,
          description,
          video_url: publicUrl,
          thumbnail_url: publicUrl,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your video has been uploaded to both platforms",
      });

      // Reset form
      setTitle("");
      setDescription("");
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-black/20 rounded-lg border border-white/10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Upload Video</h2>
        <p className="text-gray-400">Share your talent with the world</p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/20 border-white/10"
        />
        
        <Textarea
          placeholder="Video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-black/20 border-white/10"
        />

        <div className="flex justify-center">
          <label className="w-full">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Video
                </>
              )}
            </Button>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};