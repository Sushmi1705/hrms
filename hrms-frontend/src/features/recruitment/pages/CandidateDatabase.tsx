import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Download, User, CheckCircle2, Filter, Eye, 
  X, Briefcase, Mail, Phone, MapPin, Globe, Star, 
  GraduationCap, Calendar, Plus, Sparkles, Trash2, 
  ExternalLink, FileText, Clock, Send
} from 'lucide-react';

export interface TalentCandidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  experience: string;
  currentCompany: string;
  education: string;
  source: 'LinkedIn' | 'Referral' | 'Career Site' | 'Agency';
  score: number;
  stage: 'Applied' | 'Screening' | 'Technical' | 'HR Round' | 'Offered' | 'Hired';
  skills: string[];
  salaryExpectation: string;
  noticePeriod: string;
  summary: string;
  recruiterNotes: string;
  appliedDate: string;
}

const INITIAL_TALENT_POOL: TalentCandidate[] = [
  {
    id: 1,
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA',
    role: 'Backend Engineer',
    experience: '6 Years',
    currentCompany: 'Stripe Inc.',
    education: 'B.S. Computer Science, UC Berkeley',
    source: 'LinkedIn',
    score: 95,
    stage: 'Technical',
    skills: ['Go', 'Distributed Systems', 'PostgreSQL', 'Kubernetes', 'Kafka', 'AWS'],
    salaryExpectation: '$155,000 / yr',
    noticePeriod: '30 Days',
    summary: 'Senior backend architect with extensive cloud experience scaling payment streaming platforms to 2M daily transactions.',
    recruiterNotes: 'Exceptional system architecture knowledge. Solved the concurrency coding challenge in 22 minutes with full test coverage.',
    appliedDate: '18 Aug 2026'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    role: 'Product Manager',
    experience: '7 Years',
    currentCompany: 'Shopify',
    education: 'M.B.A., NYU Stern • B.A. Economics',
    source: 'Referral',
    score: 92,
    stage: 'HR Round',
    skills: ['Product Strategy', 'B2B SaaS', 'Agile Roadmaps', 'User Research', 'SQL', 'Mixpanel'],
    salaryExpectation: '$160,000 / yr',
    noticePeriod: '15 Days',
    summary: 'Product manager with track record of taking 0-to-1 enterprise SaaS products to $15M ARR across fintech and workflow automation.',
    recruiterNotes: 'Referred by VP of Product. Strong stakeholder leadership and data-driven prioritization instincts.',
    appliedDate: '21 Aug 2026'
  },
  {
    id: 3,
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 (555) 678-9012',
    location: 'Austin, TX',
    role: 'Frontend Dev',
    experience: '4.5 Years',
    currentCompany: 'Atlassian',
    education: 'B.S. Software Engineering, UT Austin',
    source: 'Career Site',
    score: 88,
    stage: 'Offered',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'GraphQL', 'Jest'],
    salaryExpectation: '$130,000 / yr',
    noticePeriod: 'Immediate',
    summary: 'Frontend engineer focused on accessible UI components, design systems, and web performance optimization.',
    recruiterNotes: 'Built a custom design token library for previous employer. Clean code and great collaborative attitude.',
    appliedDate: '26 Aug 2026'
  },
  {
    id: 4,
    name: 'Jessica Taylor',
    email: 'jessica.t@example.com',
    phone: '+1 (555) 789-0123',
    location: 'Seattle, WA',
    role: 'DevOps Architect',
    experience: '8 Years',
    currentCompany: 'Amazon Web Services',
    education: 'M.S. Computer Engineering, University of Washington',
    source: 'Agency',
    score: 94,
    stage: 'Screening',
    skills: ['Terraform', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Prometheus', 'ArgoCD'],
    salaryExpectation: '$170,000 / yr',
    noticePeriod: '45 Days',
    summary: 'DevOps & Site Reliability Engineer specialized in zero-downtime multi-cloud migrations and automated security guardrails.',
    recruiterNotes: 'Top-tier candidate for Infrastructure Lead. Has managed clusters supporting 10,000+ microservice pods.',
    appliedDate: '01 Sep 2026'
  },
  {
    id: 5,
    name: 'Alex Morgan',
    email: 'alex.m@example.com',
    phone: '+1 (555) 890-1234',
    location: 'Remote',
    role: 'UI/UX Designer',
    experience: '5 Years',
    currentCompany: 'Figma Community Partner',
    education: 'B.Des Interaction Design, RISD',
    source: 'Career Site',
    score: 82,
    stage: 'Applied',
    skills: ['Figma', 'Prototyping', 'User Journeys', 'Wireframing', 'Design Tokens'],
    salaryExpectation: '$115,000 / yr',
    noticePeriod: '30 Days',
    summary: 'Creative interaction designer with deep empathy for enterprise workflows, dashboard ergonomics, and visual polish.',
    recruiterNotes: 'Portfolio demonstrated excellent responsive design execution and user-tested workflows.',
    appliedDate: '04 Sep 2026'
  }
];

export function CandidateDatabase() {
  const [candidates, setCandidates] = useState<TalentCandidate[]>(INITIAL_TALENT_POOL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');

  // Modals
  const [selectedProfile, setSelectedProfile] = useState<TalentCandidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // New Candidate Form State
  const [newForm, setNewForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Remote',
    role: 'Full Stack Engineer',
    experience: '4 Years',
    currentCompany: 'Tech Corp',
    education: 'B.S. Computer Science',
    source: 'LinkedIn' as TalentCandidate['source'],
    skills: 'React, TypeScript, Node.js',
    salaryExpectation: '$130,000 / yr',
    noticePeriod: '30 Days',
    summary: 'Experienced developer ready for enterprise challenges.'
  });

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSource = sourceFilter === 'All' || c.source === sourceFilter;
      
      let matchScore = true;
      if (scoreFilter === '90+') matchScore = c.score >= 90;
      else if (scoreFilter === '80-89') matchScore = c.score >= 80 && c.score < 90;
      else if (scoreFilter === '<80') matchScore = c.score < 80;

      return matchSearch && matchSource && matchScore;
    });
  }, [candidates, searchTerm, sourceFilter, scoreFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = candidates.length;
    const highMatch = candidates.filter(c => c.score >= 90).length;
    const referrals = candidates.filter(c => c.source === 'Referral').length;
    const linkedIn = candidates.filter(c => c.source === 'LinkedIn').length;
    return { total, highMatch, referrals, linkedIn };
  }, [candidates]);

  // Download Formatted Candidate Resume
  const handleDownloadResume = (c: TalentCandidate) => {
    const resumeText = `
================================================================================
                      CANDIDATE CURRICULUM VITAE (CV)
                 ANRAONE ENTERPRISES ATS TALENT REPOSITORY
================================================================================
Full Name           : ${c.name}
Applied Position    : ${c.role}
Email Address       : ${c.email}
Phone Number        : ${c.phone}
Location            : ${c.location}
Current Employer    : ${c.currentCompany}
Total Experience    : ${c.experience}
Education           : ${c.education}
Source of Sourcing  : ${c.source}
Recruitment Stage   : ${c.stage}
ATS Match Score     : ${c.score}%

--------------------------------------------------------------------------------
EXECUTIVE PROFILE SUMMARY
--------------------------------------------------------------------------------
${c.summary}

--------------------------------------------------------------------------------
TECHNICAL COMPETENCIES & CORE SKILLS
--------------------------------------------------------------------------------
${c.skills.map(s => `• ${s}`).join('\n')}

--------------------------------------------------------------------------------
AVAILABILITY & COMPENSATION
--------------------------------------------------------------------------------
Expected Salary     : ${c.salaryExpectation}
Notice Period       : ${c.noticePeriod}
Date Applied        : ${c.appliedDate}

--------------------------------------------------------------------------------
INTERNAL RECRUITER & INTERVIEWER EVALUATION
--------------------------------------------------------------------------------
${c.recruiterNotes}

================================================================================
Document generated by Enterprise HRMS ATS System • Strictly Confidential
`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${c.name.replace(/\s+/g, '_')}_${c.role.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Resume Downloaded', `ATS formatted CV generated for ${c.name}`);
  };

  // Add Candidate Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) return;

    const newCandidate: TalentCandidate = {
      id: Date.now(),
      name: newForm.name,
      email: newForm.email,
      phone: newForm.phone || '+1 (555) 000-0000',
      location: newForm.location,
      role: newForm.role,
      experience: newForm.experience,
      currentCompany: newForm.currentCompany,
      education: newForm.education,
      source: newForm.source,
      score: Math.floor(80 + Math.random() * 18),
      stage: 'Applied',
      skills: newForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      salaryExpectation: newForm.salaryExpectation,
      noticePeriod: newForm.noticePeriod,
      summary: newForm.summary,
      recruiterNotes: 'Newly added to candidate talent repository.',
      appliedDate: 'Today'
    };

    setCandidates([newCandidate, ...candidates]);
    setIsAddModalOpen(false);
    showToast('Candidate Saved', `${newCandidate.name} added to the talent database.`);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Candidate Database & Talent Pool
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stats.total} Profiles
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Searchable repository of vetted applicants, skill match evaluations, resume downloads, and interviewer scorecards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Talent Pool</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <span className="text-xs text-slate-500">Active profiles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Top Match (90%+)</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.highMatch}</h3>
              <span className="text-xs text-emerald-600/80 font-medium">Strong fit candidates</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Internal Referrals</p>
              <h3 className="text-2xl font-bold text-amber-600">{stats.referrals}</h3>
              <span className="text-xs text-amber-600/80 font-medium">Employee network</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sourced via LinkedIn</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.linkedIn}</h3>
              <span className="text-xs text-slate-500">Passive outreach</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by skills, candidate name, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Source:</span>
                <select
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Sources</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Career Site">Career Site</option>
                  <option value="Agency">Agency</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Match Score:</span>
                <select
                  value={scoreFilter}
                  onChange={e => setScoreFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Scores</option>
                  <option value="90+">Top Match (90%+)</option>
                  <option value="80-89">Good Match (80% - 89%)</option>
                  <option value="<80">Below 80%</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Candidate Name</th>
                <th className="py-3.5 px-4">Applied Role</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Match Score</th>
                <th className="py-3.5 px-4 text-center">Current Stage</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No candidates match your query</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria or add new candidates.</p>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 text-xs block">{c.role}</span>
                      <span className="text-[11px] text-slate-400">{c.currentCompany}</span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {c.experience}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        c.source === 'LinkedIn'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : c.source === 'Referral'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {c.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full rounded-full ${
                              c.score >= 90 ? 'bg-emerald-500' : c.score >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`} 
                            style={{ width: `${c.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{c.score}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {c.stage}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          onClick={() => handleDownloadResume(c)}
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-100 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </Button>

                        <Button 
                          onClick={() => setSelectedProfile(c)}
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Full Candidate Profile & ATS Scorecard */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold flex items-center justify-center text-base">
                  {selectedProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedProfile.name}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700">
                      {selectedProfile.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedProfile.location} • Sourced via {selectedProfile.source}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
              {/* ATS Match Score Highlight */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-xs">ATS Skill Match Rating</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Automated resume parsing against role requirements</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-28 bg-white rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full rounded-full ${
                        selectedProfile.score >= 90 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${selectedProfile.score}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-indigo-700 text-sm">{selectedProfile.score}%</span>
                </div>
              </div>

              {/* Contact & Professional Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">{selectedProfile.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone Number</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Current Company</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.currentCompany}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Experience</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.experience}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Notice Period</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.noticePeriod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Salary Expectation</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.salaryExpectation}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block font-medium">Education</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedProfile.education}</span>
                </div>
              </div>

              {/* Evaluated Competencies */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Verified Skills & Tech Stack
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.skills.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Professional Bio & Summary
                </label>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedProfile.summary}
                </p>
              </div>

              {/* Recruiter Evaluation Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Interviewer & Sourcing Feedback
                </label>
                <p className="text-slate-800 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                  {selectedProfile.recruiterNotes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <Button
                onClick={() => handleDownloadResume(selectedProfile)}
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download CV
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    showToast('Invitation Dispatched', `Interview scheduling link emailed to ${selectedProfile.email}`);
                  }}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProfile(null)}
                  className="border-slate-200 text-slate-600 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Candidate to Talent Pool */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold">Add Candidate to Talent Pool</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Rachel Green"
                    value={newForm.name}
                    onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <Input
                    required
                    type="email"
                    placeholder="rachel@example.com"
                    value={newForm.email}
                    onChange={e => setNewForm({ ...newForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={newForm.phone}
                    onChange={e => setNewForm({ ...newForm, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                  <Input
                    placeholder="e.g. Backend Engineer"
                    value={newForm.role}
                    onChange={e => setNewForm({ ...newForm, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={newForm.source}
                    onChange={e => setNewForm({ ...newForm, source: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Career Site">Career Site</option>
                    <option value="Agency">Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Experience</label>
                  <Input
                    placeholder="e.g. 5 Years"
                    value={newForm.experience}
                    onChange={e => setNewForm({ ...newForm, experience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notice Period</label>
                  <Input
                    placeholder="e.g. 30 Days"
                    value={newForm.noticePeriod}
                    onChange={e => setNewForm({ ...newForm, noticePeriod: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
                  <Input
                    placeholder="e.g. Python, Docker, React, AWS"
                    value={newForm.skills}
                    onChange={e => setNewForm({ ...newForm, skills: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Bio / Profile Summary</label>
                  <textarea
                    className="w-full h-20 p-2.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Key career highlights..."
                    value={newForm.summary}
                    onChange={e => setNewForm({ ...newForm, summary: e.target.value })}
                  />
                </div>
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
                  Save to Pool
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
