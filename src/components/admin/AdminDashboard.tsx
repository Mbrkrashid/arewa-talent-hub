import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Users, Trophy, BarChart3 } from "lucide-react";
import { JudgeManagement } from "./JudgeManagement";
import { PlatformStats } from "./PlatformStats";

type AdminView = 'judges' | 'stats';

export const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('judges');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white/90">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant={currentView === 'judges' ? 'default' : 'outline'}
            onClick={() => setCurrentView('judges')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Manage Judges
          </Button>
          <Button
            variant={currentView === 'stats' ? 'default' : 'outline'}
            onClick={() => setCurrentView('stats')}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Platform Stats
          </Button>
        </div>
      </div>

      {currentView === 'judges' ? (
        <JudgeManagement />
      ) : (
        <PlatformStats />
      )}
    </div>
  );
};