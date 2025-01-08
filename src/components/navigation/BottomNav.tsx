import { Home, Compass, Upload, User, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        <Link 
          to="/"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/' ? 'text-primary' : 'text-white/60'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/explore"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/explore' ? 'text-primary' : 'text-white/60'}`}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs">Explore</span>
        </Link>
        
        <Link 
          to="/upload"
          className="flex flex-col items-center space-y-1"
        >
          <div className="bg-primary rounded-full p-3 -mt-6 animate-pulse">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </Link>
        
        <Link 
          to="/prizes"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/prizes' ? 'text-primary' : 'text-white/60'}`}
        >
          <Trophy className="h-6 w-6" />
          <span className="text-xs">Prizes</span>
        </Link>
        
        <Link 
          to="/profile"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/profile' ? 'text-primary' : 'text-white/60'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};