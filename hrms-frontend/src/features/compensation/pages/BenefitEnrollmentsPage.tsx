import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Plus, Calendar, CheckCircle } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { BenefitEnrollment, BenefitPlan } from '../types/compensation';
import { BenefitEnrollmentModal } from '../components/BenefitEnrollmentModal';

export const BenefitEnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<BenefitEnrollment[]>([]);
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrs, pls, emps] = await Promise.all([
        compensationApi.getBenefitEnrollments(),
        compensationApi.getBenefitPlans(),
        compensationApi.getEmployeeCompensations({ pageSize: 100 })
      ]);
      setEnrollments(enrs);
      setPlans(pls);
      setEmployees(
        emps.items.map((e) => ({
          id: e.employeeId,
          name: e.employeeName,
          employeeNumber: e.employeeNumber
        }))
      );
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEnrollment = async (data: any) => {
    await compensationApi.createBenefitEnrollment(data);
    await fetchData();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Employee Benefit Enrollments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Active employee policy elections, coverage tiers, payroll deduction schedules, and company subsidies
          </p>
        </div>

        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Enroll Employee
        </button>
      </div>

      {/* Enrollments Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Loading enrollments...</div>
        ) : enrollments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No benefit enrollments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Enrollment ID</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Elected Plan</th>
                  <th className="py-3 px-4">Coverage Tier</th>
                  <th className="py-3 px-4">Employee Share</th>
                  <th className="py-3 px-4">Employer Subsidy</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{enr.enrollmentNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{enr.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{enr.departmentName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-teal-300">{enr.planName}</div>
                      <div className="text-[11px] text-slate-400">Carrier: {enr.provider}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                        {enr.coverageTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      ${enr.employeeMonthlyContribution} / mo
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-400">
                      ${enr.employerMonthlyContribution} / mo
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(enr.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {enr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BenefitEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSubmit={handleCreateEnrollment}
        plans={plans}
        employees={employees}
      />
    </div>
  );
};
