import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
}

export function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${
          trend === "up" 
            ? "text-secondary" 
            : trend === "down" 
            ? "text-destructive" 
            : "text-muted-foreground"
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}