import { Gamepad2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenBalance } from "@/components/TokenBalance";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-primary/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <TokenBalance />
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Share Your Talent
            </Button>
            <Button
              variant="outline"
              className="border-primary/20"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};