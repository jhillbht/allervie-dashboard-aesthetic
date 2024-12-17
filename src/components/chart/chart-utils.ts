import React from 'react';
import { Mail, Facebook } from "lucide-react";

export interface ChartDataPoint {
  name: string;
  current: number;
  previous: number;
  campaign?: string;
  icon?: typeof Mail | typeof Facebook;
}

export const CHART_COLORS = {
  green: "#10B981",
  gray: "#6B7280",
  blue: "#3B82F6",
  border: "#374151"
} as const;

export const getChartMargins = (isLandscape: boolean, isMobile: boolean) => ({
  top: 20,
  right: isLandscape ? 50 : 40,
  left: isLandscape ? 60 : 50,
  bottom: isMobile ? 40 : 60
});