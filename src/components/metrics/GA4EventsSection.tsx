import React from 'react';
import { Card } from "@/components/ui/card";

export const GA4EventsSection = () => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
      <h3 className="text-sm font-medium mb-4">Patient Contact Forms</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Submissions</span>
          <span className="font-bold">247</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completion Rate</span>
          <span className="font-bold">68.5%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
          <span className="font-bold">2m 34s</span>
        </div>
      </div>
    </Card>
    
    <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
      <h3 className="text-sm font-medium mb-4">Sponsor Contact Forms</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Submissions</span>
          <span className="font-bold">89</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completion Rate</span>
          <span className="font-bold">72.3%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
          <span className="font-bold">3m 12s</span>
        </div>
      </div>
    </Card>
  </div>
);