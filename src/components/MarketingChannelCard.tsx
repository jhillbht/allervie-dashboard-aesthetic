import React from 'react';
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarketingChannelProps {
  name: string;
  revenue: number;
  leads: number;
  trafficSource: string;
  isHighestRevenue: boolean;
  isHighestLeads: boolean;
  maxRevenue: number;
  maxLeads: number;
}

export function MarketingChannelCard({
  name,
  revenue,
  leads,
  trafficSource,
  isHighestRevenue,
  isHighestLeads,
  maxRevenue,
  maxLeads
}: MarketingChannelProps) {
  return (
    <Card className="p-4 relative bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/60 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            via {trafficSource}
          </p>
        </div>
        {(isHighestRevenue || isHighestLeads) && (
          <div className="flex gap-1">
            {isHighestRevenue && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Highest Revenue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isHighestLeads && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Crown className="h-6 w-6 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Most Leads</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <span className={`font-medium ${revenue === maxRevenue ? 'text-green-500' : ''}`}>
              ${revenue.toLocaleString()}
            </span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Generated Leads</span>
            <span className={`font-medium ${leads === maxLeads ? 'text-blue-500' : ''}`}>
              {leads.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}