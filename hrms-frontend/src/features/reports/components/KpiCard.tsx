import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate';
  badge?: string;
  onClick?: () => void;
  tooltip?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendLabel,
  color = 'indigo',
  badge,
  onClick,
  tooltip
}) => {
  const colorStyles: Record<string, { bg: string; text: string; ring: string }> = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-900/30' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-900/30' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-100 dark:ring-amber-900/30' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-100 dark:ring-rose-900/30' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-100 dark:ring-sky-900/30' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-100 dark:ring-purple-900/30' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', ring: 'ring-slate-200 dark:ring-slate-700' }
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <Card
      onClick={onClick}
      title={tooltip}
      className={`hover:shadow-md transition-all duration-200 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''
      }`}
    >

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {title}
              </span>
              {badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 truncate">
              {value}
            </h3>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {trend !== undefined && (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                    trend > 0
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                      : trend < 0
                      ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
                      : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {trend > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : trend < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
              {subtitle && (
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  {subtitle}
                </span>
              )}
              {trendLabel && (
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                  {trendLabel}
                </span>
              )}
            </div>
          </div>

          <div
            className={`p-3 rounded-xl ${style.bg} ${style.text} ring-1 ${style.ring} shrink-0 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
