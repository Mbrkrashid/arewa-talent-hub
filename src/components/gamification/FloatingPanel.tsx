import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FloatingPanelProps {
  onClose: () => void;
  animationDelay?: string;
  children: React.ReactNode;
}

export const FloatingPanel = ({ 
  onClose, 
  animationDelay,
  children 
}: FloatingPanelProps) => {
  return (
    <div 
      className="relative animate-float"
      style={{ animationDelay }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="w-72">
        {children}
      </div>
    </div>
  );
};