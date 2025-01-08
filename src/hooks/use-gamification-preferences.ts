import { useState, useEffect } from "react";

interface GamificationPreferences {
  achievements: boolean;
  leaderboard: boolean;
}

export const useGamificationPreferences = () => {
  const [showAchievements, setShowAchievements] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('gamificationPreferences');
    if (savedPreferences) {
      const { achievements, leaderboard } = JSON.parse(savedPreferences);
      setShowAchievements(achievements);
      setShowLeaderboard(leaderboard);
    }
  }, []);

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

  return {
    showAchievements,
    showLeaderboard,
    toggleAchievements,
    toggleLeaderboard
  };
};