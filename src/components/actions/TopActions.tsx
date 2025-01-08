import { Bell, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopActionsProps {
  userRole: string | null;
}

export const TopActions = ({ userRole }: TopActionsProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
      {userRole === 'participant' && (
        <Button
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90"
          onClick={() => window.location.href = '/upload'}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="bg-black/50 hover:bg-black/70 text-white rounded-full"
      >
        <Bell className="h-6 w-6" />
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
          3
        </Badge>
      </Button>
    </div>
  );
};