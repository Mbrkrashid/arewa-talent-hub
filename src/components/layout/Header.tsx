import { Button } from "@/components/ui/button";
import { TokenBalance } from "@/components/TokenBalance";
import { Upload, Menu } from "lucide-react";
import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();
      
      return data?.is_super_admin || false;
    }
  });

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arewa Talent Hub
            </h1>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TokenBalance />
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload Talent
            </Button>
          </div>
        </div>
      </div>
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </header>
  );
};