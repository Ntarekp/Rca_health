"use client";

import React from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  item: string;
  type: 'in' | 'out';
  reason?: string;
  handledBy?: string;
}

const RecentTransactions: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2 Days ago',
      item: '7500 kg of Rice',
      type: 'in'
    },
    {
      id: '2',
      date: '2 Days ago',
      item: '7500 kg of Rice',
      type: 'out',
      reason: 'Dinner preparation',
      handledBy: 'Ferdinand'
    },
    {
      id: '3',
      date: '2 Days ago',
      item: '7500 kg of Rice',
      type: 'in'
    },
    {
      id: '4',
      date: '2 Days ago',
      item: '7500 kg of Rice',
      type: 'out',
      reason: 'Dinner preparation',
      handledBy: 'Ferdinand'
    }
  ];

  return (
    <div className="bg-bg-card border border-border rounded-12 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-light">
        <h2 className="text-18px font-bold text-text-primary flex items-center gap-2">
          <Clock size={20} className="text-primary" />
          Recent Activity
        </h2>
        <button className="flex items-center gap-1.5 text-12px font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-8 transition-all">
          <span>View More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-start gap-4 p-4 rounded-10 border border-transparent hover:border-border hover:bg-bg-secondary/30 transition-all group">
            <div className={`p-2.5 rounded-full flex-shrink-0 ${transaction.type === 'in' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
              {transaction.type === 'in' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="text-14px font-bold text-text-primary group-hover:text-primary transition-colors">{transaction.item}</h4>
                <span className="text-10px font-bold text-text-tertiary uppercase tracking-wider bg-bg-secondary px-2 py-0.5 rounded-4">{transaction.date}</span>
              </div>

              <div className="space-y-1">
                {transaction.reason && (
                  <p className="text-12px text-text-secondary leading-tight"><span className="font-semibold">Reason:</span> {transaction.reason}</p>
                )}
                {transaction.handledBy && (
                  <p className="text-11px text-text-tertiary"><span className="font-semibold">By:</span> {transaction.handledBy}</p>
                )}
              </div>
            </div>

            <div className={`text-11px font-bold px-2 py-1 rounded-full border ${transaction.type === 'in'
                ? 'bg-success/5 border-success/10 text-success'
                : 'bg-error/5 border-error/10 text-error'
              }`}>
              {transaction.type === 'in' ? 'STOCK IN' : 'STOCK OUT'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
