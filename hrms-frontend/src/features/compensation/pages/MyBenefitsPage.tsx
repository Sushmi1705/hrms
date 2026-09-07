import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Plus, Calendar, CheckCircle, Heart, Shield } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { BenefitEnrollment, BenefitPlan, EmployeeDependent } from '../types/compensation';
import { BenefitEnrollmentModal } from '../components/BenefitEnrollmentModal';
import { DependentModal } from '../components/DependentModal';

export const MyBenefitsPage: React.FC = () => {
  const [data, setData] = useState<{
    employeeId: string;
    enrolledBenefits: BenefitEnrollment[];
    eligiblePlans: BenefitPlan[];
    dependents: EmployeeDependent[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDependentModalOpen, setIsDependentModalOpen] = useState(false);

  const fetchMyBenefits = async () => {
    try {
      setLoading(true);
      const res = await compensationApi.getMyBenefits();
      setData(res);
    } catch (err) {
      console.error('Failed to load my benefits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBenefits();
  }, []);

  const handleEnroll = async (form: any) => {
    await compensationApi.createBenefitEnrollment(form);
    await fetchMyBenefits();
  };

  const handleAddDependent = async (dep: any) => {
    await compensationApi.createDependent(dep);
    await fetchMyBenefits();
  };

  const totalEmployeeDeduction =
    data?.enrolledBenefits.reduce((sum, b) => sum + b.employeeMonthlyContribution, 0) || 0;
  const totalCompanySubsidy =
    data?.enrolledBenefits.reduce((sum, b) => sum + b.employerMonthlyContribution, 0) || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Benefits & Health Coverage</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review active insurance policies, registered family dependents, and pre-tax payroll deductions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDependentModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <Users className="w-4 h-4" />
            Add Family Member
          </button>
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Enroll in Coverage
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-transparent bg-slate-900/80 border border-teal-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Benefit Plans
          </span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {data?.enrolledBenefits.length || 0}
          </div>
          <p className="text-xs text-slate-400 mt-1">Medical, Dental & Retirement</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-transparent bg-slate-900/80 border border-amber-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monthly Payroll Deduction
          </span>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
            ${totalEmployeeDeduction} / mo
          </div>
          <p className="text-xs text-slate-400 mt-1">Pre-tax payroll deduction</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent bg-slate-900/80 border border-emerald-500/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Company Monthly Subsidy
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            ${totalCompanySubsidy} / mo
          </div>
          <p className="text-xs text-slate-400 mt-1">100% employer funded benefit contribution</p>
        </div>
      </div>

      {/* Enrolled Plans Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Active Policy Elections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.enrolledBenefits.map((enr) => (
            <div
              key={enr.id}
              className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-bold text-xs">
                  {enr.planName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {enr.status}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Coverage Tier:</span>
                <span className="text-sm font-semibold text-white">{enr.coverageTier}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Your Share:</span>
                  <span className="font-bold text-amber-400">${enr.employeeMonthlyContribution}/mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Company Subsidy:</span>
                  <span className="font-bold text-teal-400">${enr.employerMonthlyContribution}/mo</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 flex justify-between">
                <span>Effective: {new Date(enr.effectiveDate).toLocaleDateString()}</span>
                <span>Renewal: {enr.renewalDate ? new Date(enr.renewalDate).toLocaleDateString() : 'Annual'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Covered Family Members */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-400" />
            Registered Family Members & Dependents
          </h2>
          <span className="text-xs font-mono text-slate-400">{data?.dependents.length || 0} Registered</span>
        </div>

        {data?.dependents.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No family members currently registered.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.dependents.map((dep) => (
              <div
                key={dep.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {dep.firstName} {dep.lastName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-pink-500/10 text-pink-300 font-semibold border border-pink-500/20">
                    {dep.relationship}
                  </span>
                </div>
                <div className="text-slate-400">
                  DOB: {new Date(dep.dateOfBirth).toLocaleDateString()} &bull; {dep.gender}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-500">
                  <span>SSN: {dep.nationalId}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {dep.verificationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {data && (
        <>
          <BenefitEnrollmentModal
            isOpen={isEnrollModalOpen}
            onClose={() => setIsEnrollModalOpen(false)}
            onSubmit={handleEnroll}
            plans={data.eligiblePlans}
            employees={[{ id: data.employeeId, name: 'You', employeeNumber: 'ME' }]}
            defaultEmployeeId={data.employeeId}
          />

          <DependentModal
            isOpen={isDependentModalOpen}
            onClose={() => setIsDependentModalOpen(false)}
            onSubmit={handleAddDependent}
            employeeId={data.employeeId}
          />
        </>
      )}
    </div>
  );
};
