import React from 'react';
import { DollarSign, Shield, Heart, Gift, Award } from 'lucide-react';
import { TotalRewardsStatement } from '../types/compensation';

interface Props {
  statement: TotalRewardsStatement | null;
  loading: boolean;
}

export const TotalRewardsCard: React.FC<Props> = ({ statement, loading }) => {
  if (loading || !statement) {
    return (
      <div className="h-64 rounded-2xl bg-slate-800/40 backdrop-blur-md animate-pulse border border-slate-700/50" />
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const annualBase = statement.annualBaseSalary ?? statement.baseSalaryAnnual ?? statement.baseSalary ?? 0;
  const annualAllowances = statement.annualAllowances ?? statement.totalAllowancesAnnual ?? 0;
  const annualBonuses = statement.annualBonuses ?? statement.totalBonusesAnnual ?? 0;
  const employerHealth = statement.employerHealthBenefitsCost ?? statement.employerMedicalBenefitAnnual ?? 0;
  const employerRetirement = statement.employerRetirementContribution ?? statement.employerRetirementMatchAnnual ?? 0;
  const totalValue = statement.totalRewardsValue ?? statement.totalRewardsValueAnnual ?? (annualBase + annualAllowances + annualBonuses + employerHealth + employerRetirement);

  const categories = [
    {
      name: 'Contracted Base Salary',
      amount: annualBase,
      percentage: totalValue > 0 ? Math.round((annualBase / totalValue) * 100) : 0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: DollarSign
    },
    {
      name: 'Cash Allowances & Stipends',
      amount: annualAllowances,
      percentage: totalValue > 0 ? Math.round((annualAllowances / totalValue) * 100) : 0,
      color: 'bg-teal-500',
      textColor: 'text-teal-400',
      icon: Gift
    },
    {
      name: 'Performance & Spot Bonuses',
      amount: annualBonuses,
      percentage: totalValue > 0 ? Math.round((annualBonuses / totalValue) * 100) : 0,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: Award
    },
    {
      name: 'Company Health Care Subsidy',
      amount: employerHealth,
      percentage: totalValue > 0 ? Math.round((employerHealth / totalValue) * 100) : 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      icon: Heart
    },
    {
      name: 'Company 401(k) Match',
      amount: employerRetirement,
      percentage: totalValue > 0 ? Math.round((employerRetirement / totalValue) * 100) : 0,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      icon: Shield
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-slate-950/60 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Total Rewards Portfolio
            </span>
            <span className="text-xs text-slate-400 font-mono">FY 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5">{statement.employeeName}</h2>
          <p className="text-xs text-slate-400">
            {statement.designationTitle} &bull; {statement.departmentName}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Annual Economic Value
          </span>
          <div className="text-3xl lg:text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            {formatCurrency(totalValue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct compensation + full company benefit contributions</p>
        </div>
      </div>

      {/* Progress Multi-Bar */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${Math.max(1, cat.percentage)}%` }}
              className={`${cat.color} transition-all duration-500 relative group`}
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-800 ${cat.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300 truncate max-w-[150px]">{cat.name}</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {formatCurrency(cat.amount)}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${cat.textColor} bg-slate-900/60`}>
                {cat.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
