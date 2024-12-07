import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  subtitle?: string;
  className?: string;
}

export function StatsCard({ title, value, change, subtitle, className }: StatsCardProps) {
  return (
    <Card className={cn("p-6 bg-card/50 backdrop-blur-sm", className)}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-bold">{value}</h2>
        {change && (
          <span
            className={cn(
              "text-sm font-medium",
              change.type === "increase" ? "text-green-500" : "text-red-500"
            )}
          >
            {change.type === "increase" ? "+" : "-"}
            {Math.abs(change.value)}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </Card>
  );
}