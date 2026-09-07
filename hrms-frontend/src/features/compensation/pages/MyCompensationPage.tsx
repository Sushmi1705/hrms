import React, { useState, useEffect } from 'react';
import { DollarSign, Award, Gift, Calendar, History, TrendingUp } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { TotalRewardsStatement } from '../types/compensation';
import { TotalRewardsCard } from '../components/TotalRewardsCard';

export const MyCompensationPage: React.FC = () => {
  const [statement, setStatement] = useState<TotalRewardsStatement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCompensation = async () => {
      try {
        setLoading(true);
        const data = await compensationApi.getMyCompensation();
        setStatement(data);
      } catch (err) {
        console.error('Failed to load my compensation', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCompensation();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">My Compensation & Total Rewards</h1>
        <p className="text-xs text-slate-400 mt-1">
          Your complete individualized rewards statement, base compensation, allowances, and company healthcare subsidies
        </p>
      </div>

      {/* Total Rewards Visual Portfolio */}
      <TotalRewardsCard statement={statement} loading={loading} />

      {statement && (() => {
        const baseSalary = statement.annualBaseSalary ?? statement.baseSalaryAnnual ?? statement.baseSalary ?? 0;
        const annualAllowances = statement.annualAllowances ?? statement.totalAllowancesAnnual ?? 0;
        const employerHealth = statement.employerHealthBenefitsCost ?? statement.employerMedicalBenefitAnnual ?? 0;
        const employerRetirement = statement.employerRetirementContribution ?? statement.employerRetirementMatchAnnual ?? 0;
        const monthlyDirect = Math.round((baseSalary + annualAllowances) / 12);
        const monthlyBase = Math.round(baseSalary / 12);
        const monthlyAllowances = Math.round(annualAllowances / 12);
        const totalEmployerCost = employerHealth + employerRetirement;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Direct Pay Details */}
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Monthly Direct Compensation
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ${monthlyDirect.toLocaleString()} / mo
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between">
                  <span className="text-slate-300">Base Contracted Salary:</span>
                  <span className="font-mono font-bold text-white">
                    ${monthlyBase.toLocaleString()} / mo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between">
                  <span className="text-slate-300">Monthly Allowances & Stipends:</span>
                  <span className="font-mono font-bold text-teal-300">
                    ${monthlyAllowances.toLocaleString()} / mo
                  </span>
                </div>
              </div>
            </div>

            {/* Employer Subsidies & Benefits */}
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-indigo-400" />
                  Employer Paid Contributions
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  ${totalEmployerCost.toLocaleString()} / yr
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between">
                  <span className="text-slate-300">Healthcare Premium Company Subsidy:</span>
                  <span className="font-mono font-bold text-blue-400">
                    ${employerHealth.toLocaleString()} / yr
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between">
                  <span className="text-slate-300">401(k) Retirement Company Match:</span>
                  <span className="font-mono font-bold text-purple-400">
                    ${employerRetirement.toLocaleString()} / yr
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
