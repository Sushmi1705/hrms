import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, Share2, Plus, Edit2, CheckCircle2, 
  X, Briefcase, MapPin, Users, Globe, Copy, Eye, 
  Trash2, ExternalLink, Sparkles, Building2, DollarSign
} from 'lucide-react';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Hybrid' | 'Remote';
  vacancies: number;
  applicantsCount: number;
  salaryRange: string;
  experience: string;
  postedDate: string;
  status: 'Published' | 'Draft' | 'Closed';
  description: string;
}

const INITIAL_OPENINGS: JobOpening[] = [
  {
    id: 'JOB-101',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    vacancies: 2,
    applicantsCount: 48,
    salaryRange: '$130,000 - $160,000',
    experience: '5+ Years',
    postedDate: '15 Aug 2026',
    status: 'Published',
    description: 'We are seeking an experienced Backend Engineer to scale our distributed cloud microservices. Must have deep experience with Go or Python, PostgreSQL, and Kubernetes.'
  },
  {
    id: 'JOB-102',
    title: 'Lead Product Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Hybrid',
    vacancies: 1,
    applicantsCount: 32,
    salaryRange: '$120,000 - $145,000',
    experience: '4+ Years',
    postedDate: '20 Aug 2026',
    status: 'Draft',
    description: 'Lead the next generation of our enterprise design system, designing intuitive SaaS workflows for hundreds of thousands of daily corporate users.'
  },
  {
    id: 'JOB-103',
    title: 'DevOps & SRE Architect',
    department: 'Infrastructure',
    location: 'San Francisco, CA',
    type: 'Remote',
    vacancies: 1,
    applicantsCount: 19,
    salaryRange: '$150,000 - $185,000',
    experience: '7+ Years',
    postedDate: '28 Aug 2026',
    status: 'Published',
    description: 'Own multi-region AWS cloud infrastructure, automated zero-downtime CI/CD deployments, and enterprise security compliance audits.'
  },
  {
    id: 'JOB-104',
    title: 'HR Talent Acquisition Specialist',
    department: 'Human Resources',
    location: 'Chicago, IL',
    type: 'Full-time',
    vacancies: 2,
    applicantsCount: 64,
    salaryRange: '$80,000 - $95,000',
    experience: '3+ Years',
    postedDate: '01 Sep 2026',
    status: 'Published',
    description: 'Drive full-lifecycle technical and corporate recruitment, candidate experience, and university relations programs.'
  },
  {
    id: 'JOB-105',
    title: 'Frontend React Developer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Remote',
    vacancies: 3,
    applicantsCount: 82,
    salaryRange: '$110,000 - $135,000',
    experience: '3+ Years',
    postedDate: '05 Sep 2026',
    status: 'Published',
    description: 'Build fast, responsive, and accessible enterprise dashboards using modern React, TypeScript, and TailwindCSS.'
  }
];

export function JobOpenings() {
  const [openings, setOpenings] = useState<JobOpening[]>(INITIAL_OPENINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modals
  const [editingOpening, setEditingOpening] = useState<JobOpening | null>(null);
  const [sharingOpening, setSharingOpening] = useState<JobOpening | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Opening Form State
  const [newForm, setNewForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time' as JobOpening['type'],
    vacancies: 1,
    salaryRange: '$100,000 - $130,000',
    experience: '3+ Years',
    status: 'Published' as JobOpening['status'],
    description: ''
  });

  // Filtered Openings
  const filteredOpenings = useMemo(() => {
    return openings.filter(o => {
      const matchSearch = 
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchDept = deptFilter === 'All' || o.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [openings, searchTerm, statusFilter, deptFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = openings.length;
    const published = openings.filter(o => o.status === 'Published').length;
    const totalVacancies = openings.reduce((sum, o) => sum + o.vacancies, 0);
    const totalApplicants = openings.reduce((sum, o) => sum + o.applicantsCount, 0);
    return { total, published, totalVacancies, totalApplicants };
  }, [openings]);

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpening) return;

    setOpenings(prev => prev.map(o => o.id === editingOpening.id ? editingOpening : o));
    showToast('Job Updated', `Changes to ${editingOpening.title} were successfully saved.`);
    setEditingOpening(null);
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title) return;

    const newOpening: JobOpening = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      title: newForm.title,
      department: newForm.department,
      location: newForm.location,
      type: newForm.type,
      vacancies: Number(newForm.vacancies),
      applicantsCount: 0,
      salaryRange: newForm.salaryRange,
      experience: newForm.experience,
      postedDate: 'Today',
      status: newForm.status,
      description: newForm.description || 'Join our fast-growing enterprise team.'
    };

    setOpenings([newOpening, ...openings]);
    setIsNewModalOpen(false);
    setNewForm({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      vacancies: 1,
      salaryRange: '$100,000 - $130,000',
      experience: '3+ Years',
      status: 'Published',
      description: ''
    });

    showToast('Job Published', `New job opening "${newOpening.title}" created successfully.`);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setOpenings(prev => prev.map(o => {
      if (o.id === id) {
        const nextStatus: JobOpening['status'] = o.status === 'Published' ? 'Closed' : 'Published';
        showToast('Status Updated', `Job status changed to ${nextStatus}.`);
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // Copy Share Link
  const handleCopyLink = (job: JobOpening) => {
    const dummyUrl = `https://careers.anraone.com/jobs/${job.id.toLowerCase()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dummyUrl);
    }
    showToast('Link Copied', `Public career URL for ${job.title} copied to clipboard!`);
    setSharingOpening(null);
  };

  return (
    <div className="space-y-6 mt-6 relative pb-12">
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

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Job Openings (Career Postings)
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stats.published} Active
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage public job board vacancies, recruitment statuses, compensation ranges, and direct application links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsNewModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Job Opening
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Positions</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              <span className="text-xs text-slate-500">Across all teams</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live & Published</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.published}</h3>
              <span className="text-xs text-emerald-600/80 font-medium">Accepting resumes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Headcount Openings</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalVacancies}</h3>
              <span className="text-xs text-slate-500">Vacancies available</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
              <h3 className="text-2xl font-bold text-purple-600">{stats.totalApplicants}</h3>
              <span className="text-xs text-purple-600/80 font-medium">Resumes received</span>
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
                placeholder="Search job title, location, ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Department:</span>
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Openings Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Job Title</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Vacancies</th>
                <th className="py-3.5 px-4 text-center">Applicants</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOpenings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No job openings found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try changing your search keywords or post a new job opening.</p>
                  </td>
                </tr>
              ) : (
                filteredOpenings.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div>
                        <span className="font-semibold text-slate-900 block leading-snug">{o.title}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                            {o.id}
                          </span>
                          <span>•</span>
                          <span>{o.salaryRange}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                      {o.department}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{o.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {o.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {o.vacancies}
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-indigo-600">
                      {o.applicantsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(o.id)}
                        title="Click to toggle status"
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all hover:opacity-80 ${
                          o.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : o.status === 'Draft'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {o.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSharingOpening(o)}
                          variant="ghost"
                          size="sm"
                          title="Share public job link"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => setEditingOpening({ ...o })}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-slate-700 hover:text-indigo-600 border-slate-200 hover:bg-slate-50 flex items-center gap-1 font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
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

      {/* MODAL: Edit Job Opening */}
      {editingOpening && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Edit Job Opening: {editingOpening.title}</h3>
              </div>
              <button
                onClick={() => setEditingOpening(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <Input
                    required
                    value={editingOpening.title}
                    onChange={e => setEditingOpening({ ...editingOpening, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingOpening.department}
                    onChange={e => setEditingOpening({ ...editingOpening, department: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={editingOpening.type}
                    onChange={e => setEditingOpening({ ...editingOpening, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <Input
                    value={editingOpening.location}
                    onChange={e => setEditingOpening({ ...editingOpening, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacancies</label>
                  <Input
                    type="number"
                    min="1"
                    value={editingOpening.vacancies}
                    onChange={e => setEditingOpening({ ...editingOpening, vacancies: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                  <Input
                    value={editingOpening.salaryRange}
                    onChange={e => setEditingOpening({ ...editingOpening, salaryRange: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publishing Status</label>
                  <select
                    value={editingOpening.status}
                    onChange={e => setEditingOpening({ ...editingOpening, status: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Job Description & Responsibilities</label>
                  <textarea
                    className="w-full h-24 p-2.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    value={editingOpening.description}
                    onChange={e => setEditingOpening({ ...editingOpening, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingOpening(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post New Job Opening */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold">Post New Job Opening</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <Input
                    required
                    placeholder="e.g. Senior Security Engineer"
                    value={newForm.title}
                    onChange={e => setNewForm({ ...newForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newForm.department}
                    onChange={e => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={newForm.type}
                    onChange={e => setNewForm({ ...newForm, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <Input
                    placeholder="e.g. Remote (US)"
                    value={newForm.location}
                    onChange={e => setNewForm({ ...newForm, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacancies</label>
                  <Input
                    type="number"
                    min="1"
                    value={newForm.vacancies}
                    onChange={e => setNewForm({ ...newForm, vacancies: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                  <Input
                    placeholder="e.g. $120,000 - $150,000"
                    value={newForm.salaryRange}
                    onChange={e => setNewForm({ ...newForm, salaryRange: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={newForm.status}
                    onChange={e => setNewForm({ ...newForm, status: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Published">Published Immediately</option>
                    <option value="Draft">Save as Draft</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                  <textarea
                    className="w-full h-24 p-2.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    placeholder="Key responsibilities and qualifications required..."
                    value={newForm.description}
                    onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Publish Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Share Job Link */}
      {sharingOpening && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <h3 className="font-bold text-sm">Share Career Opening</h3>
              </div>
              <button
                onClick={() => setSharingOpening(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{sharingOpening.title}</p>
                <p className="text-slate-500 mt-0.5">{sharingOpening.department} • {sharingOpening.location}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Public Applicant URL</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`https://careers.anraone.com/jobs/${sharingOpening.id.toLowerCase()}`}
                    className="bg-slate-50 text-xs font-mono select-all"
                  />
                  <Button
                    onClick={() => handleCopyLink(sharingOpening)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Share this link on LinkedIn, recruitment agencies, or company social channels to collect incoming resumes.
              </p>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSharingOpening(null)}
                className="text-xs text-slate-600"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
