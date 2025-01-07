import { useState } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

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
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data: storageData } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get video URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Create video entry in database
      const { error: dbError } = await supabase
        .from('video_content')
        .insert({
          vendor_id: user.id,
          title: file.name.split('.')[0],
          video_url: publicUrl,
          description: "My talent showcase",
          thumbnail_url: publicUrl // You might want to generate a proper thumbnail
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
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-black/50">
      <Video className="h-12 w-12 text-primary animate-pulse" />
      <h3 className="text-lg font-semibold text-white">Share Your Talent</h3>
      <p className="text-sm text-gray-400 text-center">
        Upload your video to participate in the talent show
      </p>
      <label htmlFor="video-upload">
        <Button 
          className="bg-primary hover:bg-primary/90"
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </label>
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