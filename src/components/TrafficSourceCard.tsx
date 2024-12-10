import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface TrafficSourceCardProps {
  title: string;
  cvr: number;
  revenue: number;
  sessions: number;
  change: {
    value: number;
    type: "increase" | "decrease";
  };
  isHighestRevenue?: boolean;
  isHighestCvr?: boolean;
}

export function TrafficSourceCard({ 
  title, 
  cvr, 
  revenue, 
  sessions, 
  change,
  isHighestRevenue,
  isHighestCvr
}: TrafficSourceCardProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {isHighestCvr && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold">{cvr}%</p>
            <span className="text-xs text-muted-foreground">CVR</span>
          </div>
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            change.type === "increase" ? "text-green-500" : "text-red-500"
          )}
        >
          {change.type === "increase" ? "+" : "-"}
          {Math.abs(change.value)}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Revenue</p>
          <p className={cn("font-medium", isHighestRevenue && "text-green-500")}>
            ${revenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Sessions</p>
          <p className="font-medium">{sessions.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}