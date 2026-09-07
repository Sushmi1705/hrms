import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, Shield, Plus, Users, Check, AlertCircle } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { BenefitPlan } from '../types/compensation';
import { BenefitPlanModal } from '../components/BenefitPlanModal';

export const BenefitPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BenefitPlan | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await compensationApi.getBenefitPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch benefit plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (data: Partial<BenefitPlan>) => {
    await compensationApi.createBenefitPlan(data);
    await fetchPlans();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Corporate Health & Welfare Benefits</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise health insurance, dental, vision, group life, and 401(k) retirement offerings
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            setIsPlanModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Benefit Plan
        </button>
      </div>

      {/* Plans Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-teal-500/40 transition-all space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-bold text-xs">
                  {plan.planCode}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {plan.type}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {plan.planName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Carrier: {plan.provider} &bull; {plan.policyNumber}
                </p>
              </div>

              {/* Monthly Contribution Rates */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Employee Payroll Share:</span>
                  <span className="font-mono font-bold text-amber-400">
                    ${plan.employeeMonthlyCost} / mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Company Paid Subsidy:</span>
                  <span className="font-mono font-bold text-teal-400">
                    ${plan.employerMonthlyCost} / mo
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-700/70 flex justify-between items-center font-semibold">
                  <span className="text-slate-300">Total Premium:</span>
                  <span className="font-mono text-white">
                    ${plan.employeeMonthlyCost + plan.employerMonthlyCost} / mo
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                {plan.allowsDependents ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    Family & Dependents Eligible
                  </>
                ) : (
                  'Individual Only'
                )}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <BenefitPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmit={handleSavePlan}
        initialData={editingPlan}
      />
    </div>
  );
};
