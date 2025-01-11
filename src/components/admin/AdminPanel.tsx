import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Settings, Users, Video, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AdminCampaigns } from "./AdminCampaigns";
import { AdminUsers } from "./AdminUsers";
import { AdminVideos } from "./AdminVideos";
import { AdminAnalytics } from "./AdminAnalytics";

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'users' | 'videos' | 'analytics'>('campaigns');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 p-4 border-b">
          <Button
            variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('campaigns')}
            className="flex flex-col items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs">Campaigns</span>
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="flex flex-col items-center gap-1"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs">Users</span>
          </Button>
          <Button
            variant={activeTab === 'videos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('videos')}
            className="flex flex-col items-center gap-1"
          >
            <Video className="h-4 w-4" />
            <span className="text-xs">Videos</span>
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="flex flex-col items-center gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </Button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {activeTab === 'campaigns' && <AdminCampaigns />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'videos' && <AdminVideos />}
          {activeTab === 'analytics' && <AdminAnalytics />}
        </div>
      </div>
    </div>
  );
};