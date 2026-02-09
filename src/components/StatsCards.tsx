"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  isPrimary?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, isPrimary = false }) => {
  return (
    <div className={`p-5 rounded-10 border transition-all duration-300 group hover:shadow-md ${isPrimary
      ? 'bg-primary border-primary shadow-lg shadow-primary/20'
      : 'bg-bg-card border-border hover:border-primary/30'
      }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`text-12px font-bold uppercase tracking-wider ${isPrimary ? 'text-white/70' : 'text-text-tertiary font-semibold'}`}>
          {title}
        </div>
        <button className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${isPrimary ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-bg-secondary text-text-tertiary hover:bg-primary/5 hover:text-primary'
          }`}>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        <div className={`text-32px font-bold leading-none ${isPrimary ? 'text-white' : 'text-text-primary'}`}>
          {value}
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-10px font-bold border ${changeType === 'positive'
            ? isPrimary ? 'bg-white/10 text-white border-white/20' : 'bg-success/10 text-success border-success/10'
            : isPrimary ? 'bg-white/10 text-white border-white/20' : 'bg-error/10 text-error border-error/10'
            }`}>
            {changeType === 'positive' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {change}
          </div>
          <span className={`text-10px ${isPrimary ? 'text-white/60' : 'text-text-tertiary font-medium'}`}>
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
};

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Consultations"
        value="1,245"
        change="12.5%"
        changeType="positive"
        isPrimary={true}
      />
      <StatCard
        title="Students Registered"
        value="892"
        change="3.2%"
        changeType="positive"
      />
      <StatCard
        title="Lab Tests Completed"
        value="438"
        change="8.1%"
        changeType="positive"
      />
      <StatCard
        title="Critical Medications"
        value="12"
        change="2.0%"
        changeType="negative"
      />
    </div>
  );
};

export default StatsCards;
