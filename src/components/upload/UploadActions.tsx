import { Upload, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadActionsProps {
  uploading: boolean;
  onFileInputClick: () => void;
}

export const UploadActions = ({ uploading, onFileInputClick }: UploadActionsProps) => {
  const { toast } = useToast();

  const handleSocialImport = () => {
    toast({
      title: "Coming Soon",
      description: "Social media integration will be available soon!",
    });
  };

  return (
    <div className="flex gap-4">
      <Button 
        className="bg-primary hover:bg-primary/90"
        disabled={uploading}
        onClick={onFileInputClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Video"}
      </Button>

      <Button
        variant="outline"
        className="gap-2"
        onClick={handleSocialImport}
      >
        <Youtube className="h-4 w-4" />
        Import from YouTube
      </Button>

      <Button
        variant="outline"
        className="gap-2"
        onClick={handleSocialImport}
      >
        <Instagram className="h-4 w-4" />
        Import from Instagram
      </Button>
    </div>
  );
};