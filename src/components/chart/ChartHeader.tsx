import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ChartHeaderProps {
  chartRef: React.RefObject<HTMLDivElement>;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({ chartRef }) => {
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
  );
};