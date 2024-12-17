import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesComparisonCardProps {
  title: string;
  revenue: number;
  leads: number;
  isWinner: boolean;
}

export function SalesComparisonCard({ 
  title, 
  revenue, 
  leads,
  isWinner
}: SalesComparisonCardProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {isWinner && <Crown className="h-4 w-4 text-yellow-500" />}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Revenue</p>
          <p className="text-2xl font-bold">
            ${revenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Generated Leads</p>
          <p className="text-2xl font-bold">{leads.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}