import React, { useState, useEffect } from 'react';
import { Layers, Award, MapPin, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { compensationApi } from '../api/compensationApi';
import { PayGrade, SalaryBand, CompensationComponent } from '../types/compensation';
import { PayGradeModal } from '../components/PayGradeModal';
import { SalaryComponentModal } from '../components/SalaryComponentModal';

export const SalaryStructuresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grades' | 'bands' | 'components'>('grades');
  const [grades, setGrades] = useState<PayGrade[]>([]);
  const [bands, setBands] = useState<SalaryBand[]>([]);
  const [components, setComponents] = useState<CompensationComponent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<PayGrade | null>(null);

  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<CompensationComponent | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [g, b, c] = await Promise.all([
        compensationApi.getPayGrades(),
        compensationApi.getSalaryBands(),
        compensationApi.getComponents()
      ]);
      setGrades(g);
      setBands(b);
      setComponents(c);
    } catch (err) {
      console.error('Failed to load salary structures', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGrade = async (data: Partial<PayGrade>) => {
    await compensationApi.createPayGrade(data);
    await fetchData();
  };

  const handleSaveComponent = async (data: Partial<CompensationComponent>) => {
    if (editingComponent) {
      await compensationApi.updateComponent(editingComponent.id, data);
    } else {
      await compensationApi.createComponent(data);
    }
    await fetchData();
  };

  const handleDeleteComponent = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this compensation component?')) {
      await compensationApi.deleteComponent(id);
      await fetchData();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Salary Architecture & Structures</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure hierarchical pay grades, geographic salary bands, and compensation component calculations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'grades' && (
            <button
              onClick={() => {
                setEditingGrade(null);
                setIsGradeModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Pay Grade
            </button>
          )}

          {activeTab === 'components' && (
            <button
              onClick={() => {
                setEditingComponent(null);
                setIsComponentModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Component
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('grades')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'grades'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" />
          Pay Grades ({grades.length})
        </button>

        <button
          onClick={() => setActiveTab('bands')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'bands'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Salary Bands ({bands.length})
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'components'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Salary Components ({components.length})
        </button>
      </div>

      {/* Tab Content: Pay Grades */}
      {activeTab === 'grades' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {grades.map((grade) => {
            const spread =
              grade.minimumSalary > 0
                ? (((grade.maximumSalary - grade.minimumSalary) / grade.minimumSalary) * 100).toFixed(0)
                : '0';

            return (
              <div
                key={grade.id}
                className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
                    {grade.code}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Level {grade.level}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {grade.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {grade.employeeCount || 0} Employees in this tier
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Min:</span>
                    <span>${grade.minimumSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-indigo-300 font-bold">
                    <span>Mid (P50):</span>
                    <span>${grade.midpointSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Max:</span>
                    <span>${grade.maximumSalary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span>Band Spread: {spread}%</span>
                  <span className="text-slate-400">{grade.currency}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Salary Bands */}
      {activeTab === 'bands' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Band Name</th>
                  <th className="py-3 px-4">Grade Reference</th>
                  <th className="py-3 px-4">Location / Country</th>
                  <th className="py-3 px-4">Minimum</th>
                  <th className="py-3 px-4">Midpoint</th>
                  <th className="py-3 px-4">Maximum</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {bands.map((band) => (
                  <tr key={band.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{band.bandName}</td>
                    <td className="py-3 px-4 font-mono text-purple-400">{band.gradeCode || 'Grade Base'}</td>
                    <td className="py-3 px-4 text-slate-400">{band.locationName || band.country}</td>
                    <td className="py-3 px-4 font-mono">${band.minimum.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                      ${band.midpoint.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">${band.maximum.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Salary Components */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
                  {comp.code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                  {comp.type}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{comp.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{comp.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {comp.calculationType === 'Percentage'
                    ? `${comp.percentage}% of Base`
                    : `$${(comp.defaultValue || 0).toLocaleString()} fixed`}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                {comp.isTaxable && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Taxable</span>
                )}
                {comp.isPensionable && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Pensionable</span>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingComponent(comp);
                      setIsComponentModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {comp.code !== 'BASIC' && (
                    <button
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PayGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onSubmit={handleSaveGrade}
        initialData={editingGrade}
      />

      <SalaryComponentModal
        isOpen={isComponentModalOpen}
        onClose={() => setIsComponentModalOpen(false)}
        onSubmit={handleSaveComponent}
        initialData={editingComponent}
      />
    </div>
  );
};
