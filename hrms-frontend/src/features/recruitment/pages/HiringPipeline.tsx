import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  User, Calendar, CheckCircle2, ChevronRight, ChevronLeft, 
  Search, Plus, Filter, Star, Mail, Phone, MapPin, 
  Briefcase, FileText, X, AlertCircle, Trash2, ArrowRight, 
  ExternalLink, Sparkles
} from 'lucide-react';

export type PipelineStageId = 'applied' | 'screening' | 'technical' | 'hr' | 'offered' | 'hired';

export interface PipelineCandidate {
  id: number;
  name: string;
  role: string;
  department: string;
  stage: PipelineStageId;
  date: string;
  email: string;
  phone: string;
  experience: string;
  rating: number;
  tags: string[];
  notes: string;
  resumeSummary: string;
  salaryExpectation: string;
}

const STAGES: { id: PipelineStageId; title: string; color: string; badgeColor: string }[] = [
  { id: 'applied', title: 'Applied', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'screening', title: 'Screening', color: 'border-t-amber-500', badgeColor: 'bg-amber-100 text-amber-800' },
  { id: 'technical', title: 'Technical', color: 'border-t-purple-500', badgeColor: 'bg-purple-100 text-purple-800' },
  { id: 'hr', title: 'HR Round', color: 'border-t-indigo-500', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'offered', title: 'Offered', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'hired', title: 'Hired', color: 'border-t-teal-600', badgeColor: 'bg-teal-100 text-teal-800' }
];

const STAGE_ORDER: PipelineStageId[] = ['applied', 'screening', 'technical', 'hr', 'offered', 'hired'];

const INITIAL_CANDIDATES: PipelineCandidate[] = [
  { 
    id: 1, 
    name: 'John Smith', 
    role: 'Backend Eng.', 
    department: 'Engineering', 
    stage: 'applied', 
    date: '5h ago',
    email: 'john.smith@example.com',
    phone: '+1 (555) 234-5678',
    experience: '5+ Years (Go, Distributed Systems)',
    rating: 4,
    tags: ['Go', 'Kubernetes', 'PostgreSQL', 'Microservices'],
    notes: 'Strong open source contributions. Recommended for initial phone screening.',
    resumeSummary: 'Experienced backend systems engineer focusing on high-throughput microservices and distributed storage architectures.',
    salaryExpectation: '$140,000 / yr'
  },
  { 
    id: 2, 
    name: 'Emma Watson', 
    role: 'HR Spec.', 
    department: 'Human Resources', 
    stage: 'screening', 
    date: '3d ago',
    email: 'emma.watson@example.com',
    phone: '+1 (555) 345-6789',
    experience: '4 Years (Talent Ops & SHRM-CP)',
    rating: 4,
    tags: ['Recruiting', 'SHRM', 'Employee Relations', 'Workday'],
    notes: 'Phone screening scheduled for tomorrow 2 PM. High cultural alignment.',
    resumeSummary: 'HR specialist specializing in technical talent acquisition, onboarding experience, and compliance auditing.',
    salaryExpectation: '$85,000 / yr'
  },
  { 
    id: 3, 
    name: 'Michael Chen', 
    role: 'Backend Eng.', 
    department: 'Engineering', 
    stage: 'technical', 
    date: '2d ago',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 456-7890',
    experience: '6 Years (Python, Cloud Systems)',
    rating: 5,
    tags: ['Python', 'AWS', 'Kafka', 'System Design'],
    notes: 'Passed live coding round with 95% score. Next: System Architecture panel with Tech Lead.',
    resumeSummary: 'Senior backend architect with extensive cloud experience scaling payment streaming platforms to 2M daily transactions.',
    salaryExpectation: '$155,000 / yr'
  },
  { 
    id: 4, 
    name: 'Sarah Jenkins', 
    role: 'Product Mgr', 
    department: 'Product', 
    stage: 'hr', 
    date: '1d ago',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 567-8901',
    experience: '7 Years (B2B SaaS Products)',
    rating: 5,
    tags: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
    notes: 'Final leadership round with VP of Product. Very positive references from previous employer.',
    resumeSummary: 'Product manager with track record of taking 0-to-1 enterprise SaaS products to $15M ARR.',
    salaryExpectation: '$160,000 / yr'
  },
  { 
    id: 5, 
    name: 'David Wilson', 
    role: 'Frontend Dev', 
    department: 'Engineering', 
    stage: 'offered', 
    date: '4h ago',
    email: 'david.wilson@example.com',
    phone: '+1 (555) 678-9012',
    experience: '4.5 Years (React, Next.js, TypeScript)',
    rating: 5,
    tags: ['React', 'TypeScript', 'Tailwind', 'Design Systems'],
    notes: 'Offer letter dispatched on Monday. Candidate indicated high intent to sign.',
    resumeSummary: 'Frontend engineer passionate about design systems, accessible UX, and performance optimization.',
    salaryExpectation: '$130,000 / yr'
  },
  { 
    id: 6, 
    name: 'Jessica Taylor', 
    role: 'DevOps Architect', 
    department: 'Infrastructure', 
    stage: 'applied', 
    date: '1d ago',
    email: 'jessica.t@example.com',
    phone: '+1 (555) 789-0123',
    experience: '8 Years (Terraform, CI/CD, AWS)',
    rating: 4,
    tags: ['Terraform', 'CI/CD', 'AWS', 'Security'],
    notes: 'Resume flagged by ATS matching 92% keywords for Infrastructure Lead.',
    resumeSummary: 'DevOps & Site Reliability Engineer specialized in zero-downtime infrastructure migrations and container orchestration.',
    salaryExpectation: '$165,000 / yr'
  },
  { 
    id: 7, 
    name: 'Liam Neeson', 
    role: 'Frontend Dev', 
    department: 'Engineering', 
    stage: 'screening', 
    date: '2d ago',
    email: 'liam.n@example.com',
    phone: '+1 (555) 890-1234',
    experience: '3 Years (Vue, React, CSS)',
    rating: 3,
    tags: ['JavaScript', 'React', 'HTML/CSS'],
    notes: 'Initial recruiter call completed. Portfolio looks promising.',
    resumeSummary: 'Full-stack leaning frontend developer building clean, responsive web user experiences.',
    salaryExpectation: '$105,000 / yr'
  }
];

export function HiringPipeline() {
  const [candidates, setCandidates] = useState<PipelineCandidate[]>(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  
  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineCandidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Drag and drop state
  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);

  // New candidate form
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    role: 'Backend Eng.',
    department: 'Engineering',
    stage: 'applied' as PipelineStageId,
    email: '',
    phone: '',
    experience: '3+ Years',
    salaryExpectation: '$120,000 / yr',
    tags: 'React, TypeScript',
    notes: ''
  });

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = selectedRole === 'All' || c.role === selectedRole;
      return matchSearch && matchRole;
    });
  }, [candidates, searchTerm, selectedRole]);

  // Unique roles for filter dropdown
  const roles = useMemo(() => {
    const list = Array.from(new Set(candidates.map(c => c.role)));
    return ['All', ...list];
  }, [candidates]);

  // Move candidate to next stage
  const handleMoveForward = (candidate: PipelineCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIndex = STAGE_ORDER.indexOf(candidate.stage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];
      const nextStageTitle = STAGES.find(s => s.id === nextStage)?.title || nextStage;

      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: nextStage } : c));
      
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate(prev => prev ? { ...prev, stage: nextStage } : null);
      }

      showToast('Candidate Advanced', `${candidate.name} moved to ${nextStageTitle}.`);
    } else {
      showToast('Pipeline Complete', `${candidate.name} is already at the final Hired stage.`);
    }
  };

  // Move candidate to previous stage
  const handleMoveBackward = (candidate: PipelineCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIndex = STAGE_ORDER.indexOf(candidate.stage);
    if (currentIndex > 0) {
      const prevStage = STAGE_ORDER[currentIndex - 1];
      const prevStageTitle = STAGES.find(s => s.id === prevStage)?.title || prevStage;

      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: prevStage } : c));
      
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate(prev => prev ? { ...prev, stage: prevStage } : null);
      }

      showToast('Candidate Moved Back', `${candidate.name} returned to ${prevStageTitle}.`);
    }
  };

  // Move to specific stage
  const handleSetStage = (candidateId: number, targetStage: PipelineStageId) => {
    const stageTitle = STAGES.find(s => s.id === targetStage)?.title || targetStage;
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: targetStage } : c));
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, stage: targetStage } : null);
    }
    showToast('Stage Updated', `Moved to ${stageTitle}`);
  };

  // Remove / Disqualify candidate
  const handleRemoveCandidate = (candidateId: number) => {
    const c = candidates.find(item => item.id === candidateId);
    setCandidates(prev => prev.filter(item => item.id !== candidateId));
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate(null);
    }
    showToast('Candidate Disqualified', `${c?.name || 'Candidate'} removed from active pipeline.`);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', String(id));
    setDraggedCandidateId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStageId) => {
    e.preventDefault();
    const candidateId = Number(e.dataTransfer.getData('text/plain')) || draggedCandidateId;
    if (candidateId) {
      handleSetStage(candidateId, targetStage);
    }
    setDraggedCandidateId(null);
  };

  // Add new candidate form submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name) return;

    const candidateRecord: PipelineCandidate = {
      id: Date.now(),
      name: newCandidate.name,
      role: newCandidate.role,
      department: newCandidate.department,
      stage: newCandidate.stage,
      date: 'Just now',
      email: newCandidate.email || `${newCandidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newCandidate.phone || '+1 (555) 000-0000',
      experience: newCandidate.experience,
      rating: 4,
      tags: newCandidate.tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: newCandidate.notes || 'Added directly to pipeline.',
      resumeSummary: 'Candidate profile entered by recruiter.',
      salaryExpectation: newCandidate.salaryExpectation
    };

    setCandidates([candidateRecord, ...candidates]);
    setIsAddModalOpen(false);
    setNewCandidate({
      name: '',
      role: 'Backend Eng.',
      department: 'Engineering',
      stage: 'applied',
      email: '',
      phone: '',
      experience: '3+ Years',
      salaryExpectation: '$120,000 / yr',
      tags: 'React, TypeScript',
      notes: ''
    });

    showToast('Candidate Added', `${candidateRecord.name} added to the ${newCandidate.stage} stage.`);
  };

  return (
    <div className="space-y-6 mt-6 relative h-[780px] flex flex-col pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Control Bar: Header, Search, Filter, Add Candidate */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Hiring Pipeline
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {candidates.length} Active Candidates
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click <strong>Move</strong> to advance candidates forward through hiring stages or drag & drop cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search candidate or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
              ))}
            </select>
          </div>

          {/* Add Candidate Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="h-9 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map(stage => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
            const isLastStage = stage.id === 'hired';
            const isFirstStage = stage.id === 'applied';

            return (
              <div 
                key={stage.id} 
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, stage.id)}
                className={`w-80 bg-slate-100/70 rounded-xl border border-slate-200/90 flex flex-col h-full overflow-hidden transition-colors ${
                  draggedCandidateId ? 'hover:bg-indigo-50/50 hover:border-indigo-300' : ''
                }`}
              >
                {/* Stage Header */}
                <div className={`p-3.5 border-b border-slate-200 bg-white shadow-xs border-t-4 ${stage.color} flex justify-between items-center sticky top-0 z-10`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-800">{stage.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stage.badgeColor}`}>
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards Column */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                  {stageCandidates.length === 0 ? (
                    <div className="text-center py-12 px-4 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl bg-white/40">
                      No candidates in {stage.title}
                    </div>
                  ) : (
                    stageCandidates.map(c => {
                      return (
                        <Card 
                          key={c.id} 
                          draggable
                          onDragStart={e => handleDragStart(e, c.id)}
                          onClick={() => setSelectedCandidate(c)}
                          className="shadow-xs hover:shadow-md border border-slate-200 hover:border-indigo-400 transition-all bg-white cursor-pointer group rounded-xl overflow-hidden"
                        >
                          <CardContent className="p-4 space-y-3">
                            {/* Candidate info & initials */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shadow-xs">
                                  {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {c.name}
                                  </p>
                                  <p className="text-xs font-medium text-slate-500 mt-0.5">{c.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center text-amber-400 text-xs gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span className="font-semibold text-slate-600">{c.rating}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {c.tags.slice(0, 2).map((t, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                  {t}
                                </span>
                              ))}
                              {c.tags.length > 2 && (
                                <span className="text-[10px] text-slate-400 px-1 py-0.5">
                                  +{c.tags.length - 2}
                                </span>
                              )}
                            </div>

                            {/* Footer: Date & Movement Controls */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                              <span className="flex items-center text-slate-400 text-[11px]">
                                <Calendar className="w-3 h-3 mr-1"/> {c.date}
                              </span>

                              <div className="flex items-center gap-1">
                                {!isFirstStage && (
                                  <button
                                    onClick={e => handleMoveBackward(c, e)}
                                    title="Move to previous stage"
                                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {!isLastStage ? (
                                  <Button 
                                    onClick={e => handleMoveForward(c, e)} 
                                    size="sm"
                                    className="h-7 px-2.5 text-xs bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 transition-all font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
                                  >
                                    <span>Move</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </Button>
                                ) : (
                                  <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Hired
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Candidate Detail & Scorecard */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold flex items-center justify-center text-base">
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedCandidate.name}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700">
                      {selectedCandidate.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedCandidate.department} • Applied {selectedCandidate.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm">
              {/* Stage Progress Tracker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Current Hiring Stage
                </label>
                <div className="grid grid-cols-6 gap-1.5 bg-slate-100 p-1.5 rounded-xl text-center text-xs">
                  {STAGES.map((s, idx) => {
                    const isCurrent = s.id === selectedCandidate.stage;
                    const stageIndex = STAGE_ORDER.indexOf(s.id);
                    const currentIndex = STAGE_ORDER.indexOf(selectedCandidate.stage);
                    const isPassed = stageIndex < currentIndex;

                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSetStage(selectedCandidate.id, s.id)}
                        className={`py-2 px-1 rounded-lg font-medium transition-all text-[11px] ${
                          isCurrent
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info & Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">{selectedCandidate.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone Number</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedCandidate.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Salary Expectation</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedCandidate.salaryExpectation}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block font-medium">Experience & Specialization</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedCandidate.experience}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Evaluated Competencies
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.tags.map((tag, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Candidate Summary
                </label>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedCandidate.resumeSummary}
                </p>
              </div>

              {/* Recruiter notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Recruiter & Interviewer Notes
                </label>
                <p className="text-xs text-slate-700 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                  {selectedCandidate.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveCandidate(selectedCandidate.id)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Disqualify Candidate
              </Button>

              <div className="flex items-center gap-2">
                {selectedCandidate.stage !== 'hired' ? (
                  <Button
                    size="sm"
                    onClick={() => handleMoveForward(selectedCandidate)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled
                    className="bg-teal-600 text-white text-xs opacity-90 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Hired Candidate
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCandidate(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Candidate to Pipeline */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-bold">Add Candidate to Pipeline</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newCandidate.name}
                  onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applied Role</label>
                  <Input
                    placeholder="e.g. Backend Eng."
                    value={newCandidate.role}
                    onChange={e => setNewCandidate({ ...newCandidate, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={newCandidate.stage}
                    onChange={e => setNewCandidate({ ...newCandidate, stage: e.target.value as PipelineStageId })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="alex@example.com"
                    value={newCandidate.email}
                    onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={newCandidate.phone}
                    onChange={e => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
                <Input
                  placeholder="e.g. Python, Docker, AWS"
                  value={newCandidate.tags}
                  onChange={e => setNewCandidate({ ...newCandidate, tags: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recruiter Notes</label>
                <Input
                  placeholder="e.g. Referred by Engineering Director"
                  value={newCandidate.notes}
                  onChange={e => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Add to Pipeline
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
