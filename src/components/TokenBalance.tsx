import { Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TokenBalance = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20 animate-glow"
          >
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-medium">250</span>
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-400">Level 5</span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your voting power & level</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};