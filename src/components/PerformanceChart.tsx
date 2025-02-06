import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { CampaignLabels } from './chart/CampaignLabels';
import { ChartDataPoint, CHART_COLORS, getChartMargins } from './chart/chart-utils';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  region?: string;
  campaignType?: string;
}

// Helper function to generate random number within a range
const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

// Function to generate chart data based on filters
const generateChartData = (region: string, campaignType: string) => {
  const regionMultipliers = {
    all: 1,
    northeast: 1.2,
    midwest: 0.9,
    south: 1.1,
    west: 1.3
  };

  const campaignMultipliers = {
    all: 1,
    search: 1.15,
    performance: 1.25,
    display: 0.85
  };

  const regionMult = regionMultipliers[region as keyof typeof regionMultipliers] || 1;
  const campaignMult = campaignMultipliers[campaignType as keyof typeof campaignMultipliers] || 1;
  const totalMult = regionMult * campaignMult;

  const timePoints = ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
  return timePoints.map(name => ({
    name,
    current: randomInRange(500 * totalMult, 1500 * totalMult, 0),
    previous: randomInRange(400 * totalMult, 1600 * totalMult, 0),
    ...(Math.random() > 0.7 && {
      campaign: ['Email Campaign 3', 'Social Media Push', 'Display Ads'][Math.floor(Math.random() * 3)]
    })
  }));
};

export function PerformanceChart({ region = 'all', campaignType = 'all' }: PerformanceChartProps) {
  const [isLandscape, setIsLandscape] = React.useState(false);
  const isMobile = useIsMobile();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = React.useState(() => generateChartData(region, campaignType));

  React.useEffect(() => {
    setChartData(generateChartData(region, campaignType));
  }, [region, campaignType]);

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const toastId = toast.loading("Generating PDF...");
      
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true,
        removeContainer: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('performance-chart.pdf');
      
      toast.dismiss(toastId);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className={`bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full ${isLandscape ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Performance Over Time</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <div ref={chartRef} className={`${isLandscape ? 'h-screen' : 'h-[400px]'} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={getChartMargins(isLandscape, isMobile)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
            <XAxis
              dataKey="name"
              stroke={CHART_COLORS.gray}
              axisLine={{ strokeWidth: 1 }}
              tick={{
                dy: 20,
                fontSize: isLandscape ? 14 : 12,
                fill: CHART_COLORS.gray
              }}
              interval={0}
              height={isMobile ? 40 : 60}
              tickMargin={10}
            />
            <YAxis
              stroke={CHART_COLORS.gray}
              tick={{
                fontSize: isLandscape ? 14 : 12,
                fill: CHART_COLORS.gray
              }}
              width={isLandscape ? 60 : 50}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                fontSize: isLandscape ? "14px" : "12px",
                padding: "8px 12px"
              }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke={CHART_COLORS.blue}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke={CHART_COLORS.gray}
              strokeWidth={2}
              dot={false}
            />
            <CampaignLabels
              data={chartData}
              isMobile={isMobile}
              isLandscape={isLandscape}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}