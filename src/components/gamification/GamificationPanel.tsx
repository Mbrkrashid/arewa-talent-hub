import { useState, useEffect } from "react";
import { ParticipantLevel } from "@/components/ParticipantLevel";
import { Leaderboard } from "@/components/Leaderboard";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamificationPanelProps {
  level: number;
  totalVotes: number;
}

export const GamificationPanel = ({ level, totalVotes }: GamificationPanelProps) => {
  const [showAchievements, setShowAchievements] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('gamificationPreferences');
    if (savedPreferences) {
      const { achievements, leaderboard } = JSON.parse(savedPreferences);
      setShowAchievements(achievements);
      setShowLeaderboard(leaderboard);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (achievements: boolean, leaderboard: boolean) => {
    localStorage.setItem('gamificationPreferences', JSON.stringify({
      achievements,
      leaderboard
    }));
  };

  const toggleAchievements = () => {
    const newValue = !showAchievements;
    setShowAchievements(newValue);
    savePreferences(newValue, showLeaderboard);
  };

  const toggleLeaderboard = () => {
    const newValue = !showLeaderboard;
    setShowLeaderboard(newValue);
    savePreferences(showAchievements, newValue);
  };

  return (
    <div className="fixed right-4 top-20 space-y-4 z-50">
      {showAchievements && (
        <div className="relative animate-float">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleAchievements}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-72">
            <ParticipantLevel level={level} totalVotes={totalVotes} />
          </div>
        </div>
      )}
      
      {showLeaderboard && (
        <div className="relative animate-float" style={{ animationDelay: "0.2s" }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleLeaderboard}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-72">
            <Leaderboard />
          </div>
        </div>
      )}

      {(!showAchievements || !showLeaderboard) && (
        <div className="fixed bottom-20 right-4 flex gap-2">
          {!showAchievements && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={toggleAchievements}
              className="animate-fade-in"
            >
              Show Achievements
            </Button>
          )}
          {!showLeaderboard && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={toggleLeaderboard}
              className="animate-fade-in"
            >
              Show Leaderboard
            </Button>
          )}
        </div>
      )}
    </div>
  );
};