import { Mic, Music2 } from "lucide-react";

export const AnimatedHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-8 mb-8">
      <div className="absolute top-0 right-0 -translate-y-1/2">
        <Mic className="h-32 w-32 text-primary opacity-20 animate-pulse" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/2">
        <Music2 className="h-24 w-24 text-secondary opacity-20 animate-bounce" />
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4">Hausa Talent Show</h1>
        <p className="text-lg text-gray-300">Showcase your talent and reach stardom!</p>
      </div>
    </div>
  );
};