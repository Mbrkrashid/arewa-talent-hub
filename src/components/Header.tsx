import { Gamepad2, Upload, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenBalance } from "@/components/TokenBalance";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-primary/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <TokenBalance />
            <Button 
              className="bg-primary hover:bg-primary/90 animate-pulse"
              onClick={() => navigate("/upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Share Your Talent
            </Button>
            <Button
              variant="outline"
              className="border-primary/20 hover:bg-primary/10 transition-colors"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <TokenBalance />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 w-full"
              onClick={() => navigate("/upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Share Your Talent
            </Button>
            <Button
              variant="outline"
              className="border-primary/20 w-full"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};