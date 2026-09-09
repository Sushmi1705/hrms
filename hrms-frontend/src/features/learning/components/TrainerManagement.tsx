import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Star, UserCheck, Download, Check, 
  Send, Calendar, Award, X, Briefcase, Mail
} from 'lucide-react';

export interface TrainerRecord {
  id: number;
  name: string;
  type: 'Internal Staff' | 'External Specialist';
  spec: string;
  rating: number; // out of 5
  sessions: number;
  status: 'Active' | 'On Leave' | 'Retired';
  email: string;
  bio: string;
  certifications: string[];
}

const INITIAL_TRAINERS: TrainerRecord[] = [
  {
    id: 1,
    name: 'Dr. Evelyn Reed',
    type: 'External Specialist',
    spec: 'Executive Leadership & Conflict Coaching',
    rating: 4.9,
    sessions: 42,
    status: 'Active',
    email: 'evelyn.reed@leadership-advisory.com',
    bio: 'Former Fortune 100 VP of People Operations specializing in executive communication, high-stakes negotiations, and psychological safety.',
    certifications: ['ICF Master Certified Coach (MCC)', 'Harvard PON Negotiation Fellow']
  },
  {
    id: 2,
    name: 'Vikram Patel',
    type: 'Internal Staff',
    spec: 'Cloud Infrastructure & Kubernetes SRE',
    rating: 4.8,
    sessions: 28,
    status: 'Active',
    email: 'vikram.patel@company.com',
    bio: 'Principal Site Reliability Engineer leading hands-on infrastructure workshops, Docker containerization labs, and incident response simulations.',
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Solutions Architect Professional']
  },
  {
    id: 3,
    name: 'Chloe Bennett',
    type: 'Internal Staff',
    spec: 'Design Systems & UX Research Methodologies',
    rating: 4.7,
    sessions: 19,
    status: 'Active',
    email: 'chloe.bennett@company.com',
    bio: 'Head of Product Design guiding interactive design sprints, user testing clinics, and cross-functional product discovery sessions.',
    certifications: ['Nielsen Norman Group UX Master Certified', 'Figma Certified Design Systems Specialist']
  },
  {
    id: 4,
    name: 'Marcus Sterling',
    type: 'External Specialist',
    spec: 'Cybersecurity SOC2 & Ethical Penetration Testing',
    rating: 4.6,
    sessions: 15,
    status: 'On Leave',
    email: 'marcus.sterling@cyberguard-security.com',
    bio: 'Cybersecurity threat intelligence consultant leading red team defense drills and GDPR/HIPAA compliance certifications.',
    certifications: ['CISSP Certified Information Systems Security', 'Offensive Security Certified Professional (OSCP)']
  }
];

export function TrainerManagement() {
  const [trainers, setTrainers] = useState<TrainerRecord[]>(INITIAL_TRAINERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<TrainerRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredTrainings = useMemo(() => {
    return trainers.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [trainers, searchTerm, typeFilter]);

  const handleBookSession = (rec: TrainerRecord) => {
    setActiveDropdown(null);
    showToast(`Workshop booking request sent to ${rec.name}!`);
  };

  const handleToggleStatus = (id: number) => {
    setTrainers(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus: 'Active' | 'On Leave' = t.status === 'Active' ? 'On Leave' : 'Active';
      return { ...t, status: nextStatus };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: prev.status === 'Active' ? 'On Leave' : 'Active'
      } : null);
    }
    showToast('Trainer availability status updated!');
  };

  const handleDownloadProfile = (rec: TrainerRecord) => {
    const content = `===============================================================
               INSTRUCTOR & TRAINER DOSSIER
===============================================================
Trainer Name   : ${rec.name}
Instructor Type: ${rec.type}
Specialization : ${rec.spec}
Email Contact  : ${rec.email}
Average Rating : ${rec.rating} / 5.0 (Across ${rec.sessions} sessions)
Status         : ${rec.status.toUpperCase()}
Date Exported  : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
---------------------------------------------------------------
1. PROFESSIONAL PROFILE & BIOGRAPHY
---------------------------------------------------------------
${rec.bio}

---------------------------------------------------------------
2. CERTIFICATIONS & ACCREDITATIONS
---------------------------------------------------------------
${rec.certifications.map((c, i) => `${i + 1}. ${c}`).join('\n')}

===============================================================
Global Corporate L&D Faculty Board
Ref: FACULTY-${rec.name.replace(/\s+/g, '_').toUpperCase()}
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Trainer_Profile_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Trainer profile exported for ${rec.name}`);
    setActiveDropdown(null);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-sm flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Faculty Roster</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{trainers.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Approved instructors</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Instructors</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {trainers.filter(i => i.status === 'Active').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Available for workshops</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Instructor Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {(trainers.reduce((acc, curr) => acc + curr.rating, 0) / trainers.length).toFixed(1)} / 5.0
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Learner feedback score</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Sessions Delivered</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {trainers.reduce((acc, curr) => acc + curr.sessions, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Completed workshops</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Trainer & Instructor Management</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage internal subject-matter experts and external corporate facilitators</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search trainers, specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Internal Staff', 'External Specialist'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === f 
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold' 
                    : 'hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Trainer Name</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Specialization</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No trainer records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTrainings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.type === 'Internal Staff' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-xs font-medium text-slate-800 truncate" title={item.spec}>
                        {item.spec}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.sessions} sessions conducted</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {item.rating} / 5.0
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> On Leave
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Profile Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 font-medium flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Profile
                        </Button>

                        {/* Dropdown Menu Toggle */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4"/>
                        </Button>

                        {/* Dropdown Menu */}
                        {activeDropdown === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-0 top-9 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                Trainer Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                                Inspect Instructor Dossier
                              </button>

                              <button
                                onClick={() => handleBookSession(item)}
                                className="w-full px-3.5 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 font-medium"
                              >
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                Book Training Workshop
                              </button>

                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.status === 'Active' ? 'Mark On Leave' : 'Set Available'}
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadProfile(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Profile (.txt)
                              </button>
                            </div>
                          </>
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
          <div>Showing {filteredTrainings.length} of {trainers.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredTrainings.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Trainer Profile Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRecord.type} • {selectedRecord.spec}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Quick Metrics Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Instructor Rating:</span>
                  <div className="font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedRecord.rating} / 5.0
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Sessions Delivered:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.sessions} Workshops</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Email Address:</span>
                  <div className="font-mono text-slate-700 truncate mt-0.5">{selectedRecord.email}</div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Professional Profile & Teaching Focus
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedRecord.bio}
                </p>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Accreditations & Credentials
                </div>
                <div className="space-y-1.5">
                  {selectedRecord.certifications.map((cert, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadProfile(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Profile (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBookSession(selectedRecord)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
