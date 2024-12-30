import { Coins } from "lucide-react";
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
            className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
          >
            <Coins className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">250 Tokens</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your voting power</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};