"use client";

import React from 'react';
import { ChevronRight, LayoutDashboard, BarChart2 } from 'lucide-react';

const Charts: React.FC = () => {
  // Bar chart data - representing monthly consultations and lab tests
  const barChartData = [
    { month: 'Jan', consultations: 180, labTests: 95, medications: 42 },
    { month: 'Feb', consultations: 250, labTests: 132, medications: 58 },
    { month: 'Mar', consultations: 160, labTests: 88, medications: 35 },
    { month: 'Apr', consultations: 140, labTests: 76, medications: 41 },
    { month: 'May', consultations: 190, labTests: 102, medications: 48 },
    { month: 'Jun', consultations: 220, labTests: 118, medications: 52 },
    { month: 'Jul', consultations: 150, labTests: 82, medications: 38 },
    { month: 'Aug', consultations: 170, labTests: 91, medications: 44 },
    { month: 'Sep', consultations: 280, labTests: 148, medications: 65 },
    { month: 'Oct', consultations: 260, labTests: 138, medications: 61 },
    { month: 'Nov', consultations: 180, labTests: 96, medications: 43 },
    { month: 'Dec', consultations: 120, labTests: 64, medications: 29 }
  ];

  const maxValue = 300;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-10">
      {/* Bar Chart Section */}
      <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-8">
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 className="text-16px font-bold text-text-primary">Monthly Health Activity</h3>
              <p className="text-12px text-text-tertiary">Consultations, lab tests, and medication distribution</p>
            </div>
          </div>
          <div className="flex gap-1 p-1 bg-bg-secondary rounded-8">
            <button className="px-3 py-1.5 text-11px font-bold bg-white text-primary rounded-6 shadow-sm">This Year</button>
            <button className="px-3 py-1.5 text-11px font-bold text-text-tertiary hover:text-text-secondary transition-colors">Last Year</button>
          </div>
        </div>

        <div className="relative h-[300px] mt-12 mb-8">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-10px font-bold text-text-tertiary w-8 h-full pointer-events-none">
            <span>250</span>
            <span>200</span>
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          {/* Grid Lines */}
          <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full border-t border-border-light border-dashed" />
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute left-10 right-0 top-0 bottom-6 flex justify-between items-end gap-1">
            {barChartData.map((data) => (
              <div key={data.month} className="flex-1 flex items-end justify-center gap-1 group relative">
                <div
                  className="w-1.5 bg-primary/20 hover:bg-primary transition-all rounded-t-2"
                  style={{ height: `${(data.consultations / maxValue) * 100}%` }}
                />
                <div
                  className="w-1.5 bg-success/20 hover:bg-success transition-all rounded-t-2"
                  style={{ height: `${(data.labTests / maxValue) * 100}%` }}
                />
                <div
                  className="w-1.5 bg-warning/20 hover:bg-warning transition-all rounded-t-2"
                  style={{ height: `${(data.medications / maxValue) * 100}%` }}
                />

                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 bg-text-primary text-white text-[9px] p-2 rounded-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl whitespace-nowrap">
                  <p className="font-bold border-b border-white/20 mb-1 pb-1">{data.month}</p>
                  <p className="flex justify-between gap-4">Consultations: <span className="font-bold">{data.consultations}</span></p>
                  <p className="flex justify-between gap-4">Lab Tests: <span className="font-bold">{data.labTests}</span></p>
                  <p className="flex justify-between gap-4">Medications: <span className="font-bold">{data.medications}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-bold text-text-tertiary">
            {barChartData.map((data) => (
              <span key={data.month} className="flex-1 text-center">{data.month}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-5 mt-4 pt-6 border-t border-border-light justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-2"></div>
            <span className="text-11px font-bold text-text-secondary">Consultations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-2"></div>
            <span className="text-11px font-bold text-text-secondary">Lab Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-2"></div>
            <span className="text-11px font-bold text-text-secondary">Medications</span>
          </div>
        </div>
      </div>

      {/* Pie/Breakdown Section */}
      <div className="bg-bg-card border border-border rounded-10 p-6 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-primary" />
            <h3 className="text-15px font-bold text-text-primary">Stock Mix</h3>
          </div>
          <button className="text-11px font-bold text-primary flex items-center gap-1 hover:underline">
            Details <ChevronRight size={12} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-6">
          {/* Circular Chart Placeholder/Mockup */}
          <div className="relative w-48 h-48 rounded-full border-[15px] border-primary/10 flex items-center justify-center">
            <div className="absolute inset-[-15px] rounded-full border-[15px] border-transparent border-t-primary border-r-error/80 border-b-warning/60 rotate-45" />
            <div className="text-center">
              <div className="text-10px text-text-tertiary font-bold uppercase tracking-wider">Total Stock</div>
              <div className="text-36px font-bold text-text-primary leading-tight">35</div>
              <div className="flex items-center justify-center gap-1 text-success text-11px font-bold">
                7% <span>items</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between p-3 bg-bg-secondary/50 rounded-8 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-12px font-semibold text-text-secondary">Healthy Items</span>
            </div>
            <span className="text-13px font-bold text-text-primary">24</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-secondary/50 rounded-8 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-warning" />
              <span className="text-12px font-semibold text-text-secondary">Low Stock</span>
            </div>
            <span className="text-13px font-bold text-text-primary">7</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-secondary/50 rounded-8 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-error" />
              <span className="text-12px font-semibold text-text-secondary">Critical/Damaged</span>
            </div>
            <span className="text-13px font-bold text-text-primary">4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
