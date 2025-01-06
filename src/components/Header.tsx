import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TokenBalance } from "@/components/TokenBalance";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

  return (
    <header className="border-b border-primary/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
          </div>

          {/* Right side content */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <TokenBalance />
                {userRole === 'participant' && (
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/upload")}
                  >
                    Share Your Talent
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Sign Up / Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};