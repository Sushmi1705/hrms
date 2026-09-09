import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Award, Download, Check, Sparkles, 
  TrendingUp, UserCheck, Star, Edit3, X, Zap
} from 'lucide-react';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillRecord {
  id: number;
  name: string;
  dept: string;
  role: string;
  pskill: string;
  lvl: SkillLevel;
  sskill: string;
  secondaryLvl: SkillLevel;
  status: 'Active' | 'Under Review' | 'Gap Identified';
  lastEvaluated: string;
  evaluator: string;
  endorsementScore: number;
  competencyNotes: string;
}

const INITIAL_SKILLS: SkillRecord[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    dept: 'Engineering',
    role: 'Staff Frontend Architect',
    pskill: 'React.js & Next.js',
    lvl: 'Expert',
    sskill: 'Node.js & GraphQL',
    secondaryLvl: 'Advanced',
    status: 'Active',
    lastEvaluated: '2026-08-12',
    evaluator: 'David Miller (VP Eng)',
    endorsementScore: 98,
    competencyNotes: 'Industry-leading mastery in frontend architecture, microfrontends, and SSR performance optimization.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    dept: 'Product Management',
    role: 'Senior Product Manager',
    pskill: 'Product Strategy & Roadmapping',
    lvl: 'Intermediate',
    sskill: 'Agile & Scrum Delivery',
    secondaryLvl: 'Advanced',
    status: 'Active',
    lastEvaluated: '2026-07-20',
    evaluator: 'Emily Watson (Head of Product)',
    endorsementScore: 84,
    competencyNotes: 'Exceptional stakeholder communication; currently leveling up financial modeling and telemetry analytics.'
  },
  {
    id: 3,
    name: 'Alex Rivera',
    dept: 'Cloud & Infrastructure',
    role: 'Principal Site Reliability Eng',
    pskill: 'Kubernetes & Service Mesh',
    lvl: 'Expert',
    sskill: 'Terraform & Infrastructure-as-Code',
    secondaryLvl: 'Expert',
    status: 'Active',
    lastEvaluated: '2026-08-30',
    evaluator: 'CTO Office',
    endorsementScore: 99,
    competencyNotes: 'Spearheaded zero-downtime multi-region cluster migration. Trusted organizational mentor.'
  },
  {
    id: 4,
    name: 'Jessica Taylor',
    dept: 'Data Science & AI',
    role: 'Applied Machine Learning Eng',
    pskill: 'PyTorch & LLM Fine-Tuning',
    lvl: 'Advanced',
    sskill: 'MLOps Pipeline Deployment',
    secondaryLvl: 'Intermediate',
    status: 'Under Review',
    lastEvaluated: '2026-06-15',
    evaluator: 'Dr. Aaron Vance (Lead AI)',
    endorsementScore: 90,
    competencyNotes: 'Completed RAG and vector database specializations. Slated for promotion to Staff MLE.'
  },
  {
    id: 5,
    name: 'David Lee',
    dept: 'Security Operations',
    role: 'Security Analyst',
    pskill: 'Threat Modeling & SIEM',
    lvl: 'Beginner',
    sskill: 'Network Vulnerability Scanning',
    secondaryLvl: 'Beginner',
    status: 'Gap Identified',
    lastEvaluated: '2026-05-10',
    evaluator: 'Michael Chen (CISO)',
    endorsementScore: 62,
    competencyNotes: 'Targeted for Q4 cybersecurity intensive bootcamp to elevate threat intelligence hunting skills.'
  }
];

export function SkillsMatrix() {
  const [skills, setSkills] = useState<SkillRecord[]>(INITIAL_SKILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | SkillLevel>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillRecord | null>(null);
  const [editLvl, setEditLvl] = useState<SkillLevel>('Intermediate');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredSkills = useMemo(() => {
    return skills.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pskill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sskill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = levelFilter === 'All' || item.lvl === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [skills, searchTerm, levelFilter]);

  const handlePromoteLevel = (id: number, newLevel: SkillLevel) => {
    setSkills(prev => prev.map(s => {
      if (s.id !== id) return s;
      const newScore = newLevel === 'Expert' ? 98 : newLevel === 'Advanced' ? 88 : newLevel === 'Intermediate' ? 75 : 60;
      return { 
        ...s, 
        lvl: newLevel, 
        endorsementScore: newScore,
        status: newLevel === 'Beginner' ? 'Gap Identified' : 'Active',
        lastEvaluated: new Date().toISOString().split('T')[0] 
      };
    }));

    if (selectedSkill && selectedSkill.id === id) {
      setSelectedSkill(prev => prev ? {
        ...prev,
        lvl: newLevel,
        endorsementScore: newLevel === 'Expert' ? 98 : newLevel === 'Advanced' ? 88 : newLevel === 'Intermediate' ? 75 : 60,
        status: newLevel === 'Beginner' ? 'Gap Identified' : 'Active',
        lastEvaluated: new Date().toISOString().split('T')[0]
      } : null);
    }
    setActiveDropdown(null);
    showToast(`Proficiency updated to ${newLevel}!`);
  };

  const handleDownloadSkillDossier = (rec: SkillRecord) => {
    const content = `===============================================================
              TALENT COMPETENCY & SKILLS MATRIX DOSSIER
===============================================================
Employee Name     : ${rec.name}
Department        : ${rec.dept}
Role / Title      : ${rec.role}

PRIMARY SKILL     : ${rec.pskill}
Proficiency Level : ${rec.lvl.toUpperCase()}
Peer Endorsement  : ${rec.endorsementScore}% Confidence Rating

SECONDARY SKILL   : ${rec.sskill}
Proficiency Level : ${rec.secondaryLvl}

EVALUATION AUDIT
Status            : ${rec.status.toUpperCase()}
Evaluated Date    : ${rec.lastEvaluated}
Lead Evaluator    : ${rec.evaluator}

Manager Assessment Notes:
${rec.competencyNotes}

---------------------------------------------------------------
Certified by Corporate L&D Capability Framework
HRMS LMS Skill Intelligence Engine 2026
Generated: ${new Date().toISOString()}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Skill-Matrix-${rec.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Skill dossier downloaded for ${rec.name}!`);
    setActiveDropdown(null);
  };

  const getLevelBadge = (lvl: SkillLevel) => {
    switch (lvl) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Advanced':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Beginner':
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Mapped Talent</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{skills.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Cross-functional staff</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Expert Bench</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {skills.filter(s => s.lvl === 'Expert').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Subject matter leads</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Star className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Advanced Core</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {skills.filter(s => s.lvl === 'Advanced').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Autonomous seniors</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Skill Gaps</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {skills.filter(s => s.status === 'Gap Identified').length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Upskilling flagged</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              Organizational Skills Matrix
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Analyze workforce competencies, skill depth, endorsements, and upskilling pathways</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search staff, skill, role..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 w-64 h-9" 
              />
            </div>
            
            {/* Level Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Expert', 'Advanced', 'Intermediate', 'Beginner'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    levelFilter === lvl 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const csvHeader = 'Employee Name,Department,Role,Primary Skill,Primary Level,Secondary Skill,Secondary Level,Status,Score\n';
                const csvRows = skills.map(s => `"${s.name}","${s.dept}","${s.role}","${s.pskill}","${s.lvl}","${s.sskill}","${s.secondaryLvl}","${s.status}",${s.endorsementScore}%`).join('\n');
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HRMS-Skills-Matrix-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Exported skills matrix to CSV!');
              }}
              className="flex items-center gap-2 text-slate-700 h-9"
            >
              <Download className="w-4 h-4" /> Export Matrix
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[260px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Primary Skill</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Secondary Skill</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Zap className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No skill profiles match your search criteria</p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => { setSearchTerm(''); setLevelFilter('All'); }}
                          className="text-indigo-600 mt-1"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSkills.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-xs shrink-0">
                            {item.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 leading-tight">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.role}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{item.pskill}</span>
                          <span className="text-xs text-slate-400">({item.endorsementScore}%)</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelBadge(item.lvl)}`}>
                          {item.lvl === 'Expert' && <Star className="w-3 h-3 mr-1 fill-purple-600" />}
                          {item.lvl}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700">{item.sskill}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.secondaryLvl}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> Active
                          </span>
                        ) : item.status === 'Under Review' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1"/> Under Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3 mr-1"/> Gap Identified
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSkill(item);
                              setEditLvl(item.lvl);
                            }}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 h-8 text-xs font-medium flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Assess
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {activeDropdown === item.id && (
                            <div 
                              className="absolute right-0 top-9 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <button
                                onClick={() => {
                                  setSelectedSkill(item);
                                  setEditLvl(item.lvl);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                Skill Audit Profile
                              </button>

                              <button
                                onClick={() => handleDownloadSkillDossier(item)}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Dossier
                              </button>

                              <div className="border-t border-slate-100 my-1"></div>

                              <button
                                onClick={() => handlePromoteLevel(item.id, 'Expert')}
                                className="w-full px-4 py-2 text-xs text-purple-600 hover:bg-purple-50 flex items-center gap-2 font-medium"
                              >
                                <Star className="w-3.5 h-3.5 text-purple-500" />
                                Endorse as Expert
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Showing {filteredSkills.length} of {skills.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled={filteredSkills.length <= 5}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Assessment Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Competency Assessment</h3>
                  <p className="text-xs text-purple-200">{selectedSkill.name} • {selectedSkill.dept}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSkill(null)}
                className="text-purple-200 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-600">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Primary Competency</span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Score: {selectedSkill.endorsementScore}%
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{selectedSkill.pskill}</h4>
                <p className="text-xs text-slate-500 mt-1">Evaluated by: {selectedSkill.evaluator} ({selectedSkill.lastEvaluated})</p>
              </div>

              {/* Adjust Level Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Adjust Proficiency Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEditLvl(lvl)}
                      className={`p-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        editLvl === lvl
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/20 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Secondary Skill</span>
                  <span className="text-slate-800 font-semibold text-sm">{selectedSkill.sskill}</span>
                  <span className="text-slate-500 block">Current: {selectedSkill.secondaryLvl}</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block font-medium">Evaluation Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mt-1 ${
                    selectedSkill.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedSkill.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="text-slate-500 font-medium block mb-1">Evaluator Feedback & Context:</span>
                <p className="text-slate-700 italic">"{selectedSkill.competencyNotes}"</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadSkillDossier(selectedSkill)}
                className="flex items-center gap-2 text-slate-700"
              >
                <Download className="w-4 h-4" /> Export Dossier
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    handlePromoteLevel(selectedSkill.id, editLvl);
                    setSelectedSkill(null);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Save Level ({editLvl})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedSkill(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
