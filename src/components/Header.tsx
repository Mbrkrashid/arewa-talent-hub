import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TokenBalance } from "@/components/TokenBalance";
import { ChevronLeft, MoreVertical } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'participant' | 'voter' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setUserRole(profile?.role as 'participant' | 'voter' || null);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="bg-[#1a1b1e] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </Button>
            <h1 className="text-lg font-semibold text-white">Arewa Talent Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <TokenBalance />
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </Button>
              </>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};