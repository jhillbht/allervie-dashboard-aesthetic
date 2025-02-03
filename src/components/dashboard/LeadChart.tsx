import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { date: "Jan", leads: 400 },
  { date: "Feb", leads: 300 },
  { date: "Mar", leads: 500 },
  { date: "Apr", leads: 450 },
  { date: "May", leads: 470 },
  { date: "Jun", leads: 600 },
];

const config = {
  leads: {
    color: "#38BDF8",
  },
};

export function LeadChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Lead Generation Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={config}>
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#38BDF8"
              fill="#38BDF8"
              fillOpacity={0.2}
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}