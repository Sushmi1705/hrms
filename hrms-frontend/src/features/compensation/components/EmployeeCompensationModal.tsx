import React, { useState, useEffect } from 'react';
import { X, DollarSign, UserCheck, AlertCircle, Percent } from 'lucide-react';
import { PayGrade, SalaryBand, CompensationComponent } from '../types/compensation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  employees: Array<{ id: string; name: string; employeeNumber: string; departmentName: string }>;
  payGrades: PayGrade[];
  salaryBands: SalaryBand[];
  components: CompensationComponent[];
  initialEmployeeId?: string;
  initialBaseSalary?: number;
}

export const EmployeeCompensationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  payGrades,
  salaryBands,
  components,
  initialEmployeeId,
  initialBaseSalary
}) => {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || '');
  const [payGradeId, setPayGradeId] = useState('');
  const [salaryBandId, setSalaryBandId] = useState('');
  const [baseSalary, setBaseSalary] = useState<number>(initialBaseSalary || 75000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('MeritIncrease');
  const [selectedComponents, setSelectedComponents] = useState<Record<string, boolean>>({});
  const [componentValues, setComponentValues] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmployeeId) setEmployeeId(initialEmployeeId);
    if (initialBaseSalary) setBaseSalary(initialBaseSalary);
  }, [initialEmployeeId, initialBaseSalary]);

  // When payGrade changes, filter salary bands
  const filteredBands = payGradeId
    ? salaryBands.filter((b) => b.payGradeId === payGradeId)
    : salaryBands;

  const selectedGrade = payGrades.find((g) => g.id === payGradeId);
  const selectedBand = salaryBands.find((b) => b.id === salaryBandId);
  const midpoint = selectedBand?.midpoint || selectedGrade?.midpointSalary || 1;
  const compaRatio = midpoint > 0 ? (baseSalary / midpoint).toFixed(2) : '1.00';

  if (!isOpen) return null;

  const toggleComponent = (compId: string, defValue: number) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [compId]: !prev[compId]
    }));
    if (!componentValues[compId]) {
      setComponentValues((prev) => ({ ...prev, [compId]: defValue }));
    }
  };

  const handleComponentValueChange = (compId: string, val: number) => {
    setComponentValues((prev) => ({ ...prev, [compId]: val }));
  };

  const calculateTotalMonthly = () => {
    let total = baseSalary / 12;
    Object.entries(selectedComponents).forEach(([compId, isSelected]) => {
      if (isSelected) {
        const comp = components.find((c) => c.id === compId);
        if (comp) {
          const val = componentValues[compId] ?? comp.defaultValue ?? 0;
          if (comp.calculationType === 'Percentage') {
            total += (baseSalary / 12) * (val / 100);
          } else {
            total += val;
          }
        }
      }
    });
    return Math.round(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setError('Please select an employee.');
      return;
    }
    if (baseSalary <= 0) {
      setError('Base salary must be greater than zero.');
      return;
    }

    const assignedComponents = Object.entries(selectedComponents)
      .filter(([_, isSelected]) => isSelected)
      .map(([compId]) => {
        const comp = components.find((c) => c.id === compId);
        const val = componentValues[compId] ?? comp?.defaultValue ?? 0;
        return {
          componentId: compId,
          amount: comp?.calculationType === 'FixedAmount' ? val : undefined,
          percentage: comp?.calculationType === 'Percentage' ? val : undefined
        };
      });

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        employeeId,
        payGradeId: payGradeId || undefined,
        salaryBandId: salaryBandId || undefined,
        baseSalary,
        effectiveDate,
        reason,
        components: assignedComponents
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update compensation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Adjust Employee Compensation</h3>
              <p className="text-xs text-slate-400">
                Effective-dated salary structure, pay grade benchmarking, and allowances
              </p>
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Employee *
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeNumber}) - {emp.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Pay Grade Benchmark
              </label>
              <select
                value={payGradeId}
                onChange={(e) => {
                  setPayGradeId(e.target.value);
                  setSalaryBandId('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">-- None / Custom --</option>
                {payGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.code} - {g.name} (${g.minimumSalary.toLocaleString()} - ${g.maximumSalary.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Location Salary Band
              </label>
              <select
                value={salaryBandId}
                onChange={(e) => setSalaryBandId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">-- Standard Band --</option>
                {filteredBands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bandName} (Midpoint: ${b.midpoint.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Contracted Base Salary (Annual USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-900 border border-emerald-500/40 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Calculated Compa-Ratio
                </label>
                <div className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-white">{compaRatio} ({((parseFloat(compaRatio) || 1) * 100).toFixed(0)}%)</span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      parseFloat(compaRatio) < 0.9
                        ? 'bg-amber-500/20 text-amber-300'
                        : parseFloat(compaRatio) > 1.15
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {parseFloat(compaRatio) < 0.9 ? 'Below Range' : parseFloat(compaRatio) > 1.15 ? 'Above Range' : 'In Range'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Midpoint reference: ${midpoint.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Revision Type / Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="InitialHire">Initial Employment Offer</option>
                <option value="MeritIncrease">Annual Merit Increase</option>
                <option value="Promotion">Promotion & Role Elevation</option>
                <option value="MarketAdjustment">Market Competitiveness Adjustment</option>
                <option value="Retention">Key Talent Retention</option>
              </select>
            </div>
          </div>

          {/* Component Assignments */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Assigned Allowances & Components
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {components
                .filter((c) => c.type === 'Earnings' && c.code !== 'BASIC')
                .map((comp) => {
                  const isChecked = !!selectedComponents[comp.id];
                  const currentVal = componentValues[comp.id] ?? (comp.calculationType === 'Percentage' ? comp.percentage : comp.defaultValue) ?? 0;
                  return (
                    <div
                      key={comp.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-slate-800/90 border-emerald-500/40'
                          : 'bg-slate-800/40 border-slate-700/40'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleComponent(comp.id, currentVal)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                        />
                        <div>
                          <span className="text-xs font-semibold text-white">{comp.name}</span>
                          <span className="ml-2 text-[10px] font-mono text-slate-400">({comp.code})</span>
                          <p className="text-[10px] text-slate-400">{comp.description}</p>
                        </div>
                      </label>

                      {isChecked && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {comp.calculationType === 'Percentage' ? '%' : '$'}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={currentVal}
                            onChange={(e) => handleComponentValueChange(comp.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono text-right"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Projection Summary Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Total Projected Monthly Pay
              </span>
              <p className="text-[11px] text-slate-400">Base salary + all selected active allowances</p>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              ${calculateTotalMonthly().toLocaleString()} / mo
            </div>
          </div>

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
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving Changes...' : 'Confirm Compensation Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
