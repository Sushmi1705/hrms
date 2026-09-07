import React from 'react';
import { DollarSign, TrendingUp, Users, ShieldCheck, Clock, Award, BarChart3, PieChart } from 'lucide-react';
import { CompensationDashboardMetrics } from '../types/compensation';

interface Props {
  metrics: CompensationDashboardMetrics | null;
  loading: boolean;
}

export const CompensationStatsCards: React.FC<Props> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-800/40 backdrop-blur-md rounded-2xl animate-pulse border border-slate-700/50" />
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalSpend = metrics.totalCompensationCost ?? metrics.totalAnnualCompensationSpend ?? 0;
  const monthlyProjection = metrics.monthlyPayrollProjection ?? Math.round(totalSpend / 12);
  const compaRatio = metrics.overallCompaRatio ?? 1.02;
  const totalEmployees = metrics.totalEmployees ?? metrics.totalActiveEmployees ?? 0;
  const benefitEnrollments = metrics.employeesEnrolledInBenefits ?? metrics.activeBenefitEnrollmentsCount ?? 0;

  const cards = [
    {
      title: 'Total Annual Spend',
      value: formatCurrency(totalSpend),
      subtitle: `${formatCurrency(monthlyProjection)} / month projected`,
      icon: DollarSign,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      badge: '+4.2% YoY',
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      title: 'Overall Compa-Ratio',
      value: `${(compaRatio * 100).toFixed(1)}%`,
      subtitle: `Benchmark: 100% (Market Midpoint)`,
      icon: TrendingUp,
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/20',
      badge: compaRatio >= 0.95 && compaRatio <= 1.05 ? 'Healthy Alignment' : 'Review Needed',
      badgeColor: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      title: 'Avg Base Salary',
      value: formatCurrency(metrics.averageBaseSalary ?? 0),
      subtitle: `Across ${totalEmployees} active employees`,
      icon: Users,
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      badge: 'Grade Standardized',
      badgeColor: 'text-purple-400 bg-purple-500/10'
    },
    {
      title: 'Active Benefit Coverage',
      value: benefitEnrollments.toString(),
      subtitle: 'Health, Dental, 401(k), Life & Wellness',
      icon: ShieldCheck,
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      badge: '98% Participation',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/80 backdrop-blur-xl border ${card.borderColor} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-950/40 group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor} group-hover:rotate-6 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
                {card.value}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium truncate max-w-[170px]">{card.subtitle}</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
