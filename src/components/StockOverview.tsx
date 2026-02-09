"use client";

import React from 'react';
import { Package, MoreHorizontal, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  unit: string;
  totalIn: number;
  remaining: number;
  threshold: number;
  status: 'sufficient' | 'sufficient-green' | 'low' | 'out';
  lastOut: string;
}

const StockOverview: React.FC = () => {
  const stockItems: StockItem[] = [
    {
      id: '1',
      name: 'Ibirayi',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'sufficient',
      lastOut: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Ibirayi',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'sufficient',
      lastOut: '2 minutes ago'
    },
    {
      id: '3',
      name: 'Ibijumba',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'low',
      lastOut: '4 days ago'
    },
    {
      id: '4',
      name: 'Umunyu',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'out',
      lastOut: '2 minutes ago'
    },
    {
      id: '5',
      name: 'Umunyu',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'out',
      lastOut: '2 minutes ago'
    },
    {
      id: '6',
      name: 'Gaz',
      unit: 'kilogarama',
      totalIn: 3000,
      remaining: 50,
      threshold: 300,
      status: 'sufficient-green',
      lastOut: '2 minutes ago'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'sufficient':
        return { text: 'Sufficient', icon: CheckCircle2, color: 'text-success bg-success/10 border-success/10' };
      case 'sufficient-green':
        return { text: 'Optimal', icon: CheckCircle2, color: 'text-primary bg-primary/10 border-primary/10' };
      case 'low':
        return { text: 'Low Stock', icon: AlertCircle, color: 'text-warning-dark bg-warning/10 border-warning/10' };
      case 'out':
        return { text: 'Out of Stock', icon: XCircle, color: 'text-error bg-error/10 border-error/10' };
      default:
        return { text: 'Unknown', icon: AlertCircle, color: 'text-text-tertiary bg-bg-secondary border-border' };
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-12 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-border-light flex justify-between items-center">
        <h2 className="text-18px font-bold text-text-primary flex items-center gap-2">
          <Package size={20} className="text-primary" />
          Stock Inventory
        </h2>
        <button className="text-12px font-bold text-primary hover:underline transition-all">
          View Detailed Analytics
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary/50">
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border">Item Description</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border">Unit</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border text-center">Inflow</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border text-center">Remaining</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border text-center">Threshold</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border">Health Status</th>
              <th className="px-6 py-4 text-10px font-extrabold text-text-tertiary uppercase tracking-widest border-b border-border">Recent Exit</th>
              <th className="px-6 py-4 border-b border-border"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {stockItems.map((item, index) => {
              const config = getStatusConfig(item.status);
              const StatusIcon = config.icon;
              return (
                <tr key={item.id} className={`hover:bg-bg-primary transition-colors group ${index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/20'}`}>
                  <td className="px-6 py-4 text-14px font-bold text-text-primary">{item.name}</td>
                  <td className="px-6 py-4 text-13px text-text-secondary font-medium">{item.unit}</td>
                  <td className="px-6 py-4 text-14px font-bold text-text-primary text-center">{item.totalIn}</td>
                  <td className="px-6 py-4 text-14px font-black text-text-primary text-center">{item.remaining}</td>
                  <td className="px-6 py-4 text-13px font-bold text-text-tertiary text-center">{item.threshold}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-10px font-bold border transition-all ${config.color}`}>
                      <StatusIcon size={12} />
                      {config.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-12px font-bold text-text-tertiary italic">{item.lastOut}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-8 text-text-tertiary hover:bg-bg-secondary hover:text-primary transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOverview;
