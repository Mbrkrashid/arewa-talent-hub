import { useState } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      // Get video URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Generate thumbnail (you might want to implement a proper thumbnail generation service)
      const thumbnailUrl = publicUrl; // For now, using video URL as thumbnail

      // Create video entry in database
      const { error: dbError } = await supabase
        .from('video_content')
        .insert({
          vendor_id: user.id,
          title: file.name.split('.')[0],
          video_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          description: "My talent showcase",
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
      {uploading && (
        <div className="w-full space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-400">{Math.round(progress)}%</p>
        </div>
      )}
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