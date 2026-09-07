import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, Users } from 'lucide-react';
import { BenefitPlan, EmployeeDependent } from '../types/compensation';
import { compensationApi } from '../api/compensationApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  plans: BenefitPlan[];
  employees: Array<{ id: string; name: string; employeeNumber: string }>;
  defaultEmployeeId?: string;
}

export const BenefitEnrollmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  plans,
  employees,
  defaultEmployeeId
}) => {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || '');
  const [benefitPlanId, setBenefitPlanId] = useState('');
  const [coverageTier, setCoverageTier] = useState<string>('EmployeeOnly');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [dependents, setDependents] = useState<EmployeeDependent[]>([]);
  const [selectedDependentIds, setSelectedDependentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultEmployeeId) setEmployeeId(defaultEmployeeId);
  }, [defaultEmployeeId]);

  useEffect(() => {
    if (employeeId) {
      compensationApi.getDependents(employeeId).then(setDependents).catch(() => setDependents([]));
    } else {
      setDependents([]);
    }
  }, [employeeId]);

  const selectedPlan = plans.find((p) => p.id === benefitPlanId);

  const tierMultiplier =
    coverageTier === 'EmployeeSpouse'
      ? 1.75
      : coverageTier === 'EmployeeChildren'
      ? 1.6
      : coverageTier === 'Family'
      ? 2.2
      : 1.0;

  const baseEmpCost = selectedPlan?.employeeMonthlyCost || 0;
  const baseEmplyrCost = selectedPlan?.employerMonthlyCost || 0;

  const employeeMonthlyShare = Math.round(baseEmpCost * tierMultiplier);
  const employerMonthlyShare = Math.round(baseEmplyrCost * tierMultiplier);
  const totalMonthlyPremium = employeeMonthlyShare + employerMonthlyShare;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !benefitPlanId) {
      setError('Please select both an Employee and a Benefit Plan.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        employeeId,
        benefitPlanId,
        coverageTier,
        effectiveDate,
        coveredDependentIds: selectedDependentIds
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to complete enrollment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enroll in Benefit Plan</h3>
              <p className="text-xs text-slate-400">Select coverage tier and review pre-tax contributions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Employee *
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Benefit Offering *
            </label>
            <select
              value={benefitPlanId}
              onChange={(e) => setBenefitPlanId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">-- Select Plan --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.planName} ({p.provider}) - ${p.employeeMonthlyCost}/mo EE
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Coverage Tier
              </label>
              <select
                value={coverageTier}
                onChange={(e) => setCoverageTier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="EmployeeOnly">Employee Only (1.0x)</option>
                <option value="EmployeeSpouse">Employee + Spouse (1.75x)</option>
                <option value="EmployeeChildren">Employee + Children (1.60x)</option>
                <option value="Family">Full Family (2.20x)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Effective Date
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {/* Premium Share Summary */}
          {selectedPlan && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs">
              <span className="font-semibold text-slate-300">Monthly Contribution Breakdown:</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Employee Payroll Deduction:</span>
                <span className="font-mono font-bold text-amber-400">${employeeMonthlyShare} / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Employer Company Subsidy:</span>
                <span className="font-mono font-bold text-teal-400">${employerMonthlyShare} / mo</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between font-semibold">
                <span className="text-slate-300">Total Premium to Carrier:</span>
                <span className="font-mono text-white">${totalMonthlyPremium} / mo</span>
              </div>
            </div>
          )}

          {/* Covered Dependents */}
          {coverageTier !== 'EmployeeOnly' && dependents.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Covered Family Members
              </label>
              <div className="space-y-2">
                {dependents.map((dep) => (
                  <label
                    key={dep.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDependentIds.includes(dep.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDependentIds([...selectedDependentIds, dep.id]);
                        } else {
                          setSelectedDependentIds(selectedDependentIds.filter((id) => id !== dep.id));
                        }
                      }}
                      className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white">
                        {dep.firstName} {dep.lastName}
                      </span>
                      <span className="ml-2 text-slate-400">({dep.relationship})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Submitting...' : 'Confirm Benefit Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
