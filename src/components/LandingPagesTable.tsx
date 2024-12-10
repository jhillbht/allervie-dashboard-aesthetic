import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const landingPagesData = [
  {
    url: '/checkout/success',
    revenue: 66955.20,
    views: 3840,
    entries: 1118,
    bounce: 18.8,
    cvr: 3.7,
  },
  {
    url: '/products',
    revenue: null,
    views: 3302,
    entries: 1214,
    bounce: 19.0,
    cvr: 2.3,
  },
  {
    url: '/product/details',
    revenue: null,
    views: 3345,
    entries: 683,
    bounce: 40.0,
    cvr: 1.5,
  },
  {
    url: '/cart',
    revenue: null,
    views: 4158,
    entries: 869,
    bounce: 12.4,
    cvr: 4.5,
  },
];

export function LandingPagesTable() {
  const maxRevenue = Math.max(...landingPagesData.map(page => page.revenue || 0));

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
      <h2 className="text-lg font-medium mb-6">Landing Pages Performance</h2>
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">PAGE URL</TableHead>
              <TableHead className="text-right">REVENUE</TableHead>
              <TableHead className="text-right">VIEWS</TableHead>
              <TableHead className="text-right">ENTRIES</TableHead>
              <TableHead className="text-right">BOUNCE</TableHead>
              <TableHead className="text-right">CVR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landingPagesData.map((page) => (
              <TableRow key={page.url}>
                <TableCell className="font-mono text-sm">{page.url}</TableCell>
                <TableCell className={cn(
                  "text-right",
                  page.revenue === maxRevenue && "text-green-500"
                )}>
                  {page.revenue ? `$${page.revenue.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` : '-'}
                </TableCell>
                <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">{page.entries.toLocaleString()}</TableCell>
                <TableCell className="text-right">{page.bounce}%</TableCell>
                <TableCell className="text-right">{page.cvr}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}