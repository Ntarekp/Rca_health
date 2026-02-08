import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    trend: number;
    trendDirection: 'up' | 'down';
    variant?: 'primary' | 'default';
    icon?: ReactNode;
}

const StatsCard = ({ title, value, trend, trendDirection, variant = 'default', icon }: StatsCardProps) => {
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-bg-card)]';
    const textColor = isPrimary ? 'text-white' : 'text-[var(--color-text-secondary)]';
    const valueColor = isPrimary ? 'text-white' : 'text-[var(--color-text-primary)]';
    const subTextColor = isPrimary ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--color-text-tertiary)]';

    return (
        <div className={`${bgColor} rounded-[var(--radius-10)] p-5 relative shadow-sm transition-transform hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {icon && <div className={`p-2 rounded-lg ${isPrimary ? 'bg-white/10 text-white' : 'bg-blue-50 text-[var(--color-primary)]'}`}>{icon}</div>}
                    <h3 className={`text-[12px] font-medium ${textColor}`}>{title}</h3>
                </div>
                <button className={`${isPrimary ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                    <span className="text-[10px] flex items-center gap-1 border border-current px-2 py-0.5 rounded-full">
                        View Details <HelpCircle size={10} />
                    </span>
                </button>
            </div>

            <div className="mb-4">
                <span className={`text-[36px] font-bold ${valueColor}`}>{value}</span>
            </div>

            <div className="flex items-center gap-2">
                {trendDirection === 'up' ? (
                    <TrendingUp size={14} className="text-[var(--color-success)]" />
                ) : (
                    <TrendingDown size={14} className="text-[var(--color-error)]" />
                )}
                <span className={`text-[10px] ${trendDirection === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                    {trend}%
                </span>
                <span className={`text-[10px] ${subTextColor}`}>vs last month</span>
            </div>
        </div>
    );
};

export default StatsCard;
