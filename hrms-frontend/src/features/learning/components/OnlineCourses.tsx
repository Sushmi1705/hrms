import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Video, FileText, Download, Check, 
  Send, Play, Eye, X, HardDrive, Share2
} from 'lucide-react';

export interface OnlineContentRecord {
  id: number;
  title: string;
  format: 'SCORM 2004' | 'MP4 Video' | 'Interactive PDF' | 'xAPI Package';
  size: string;
  views: number;
  status: 'Published' | 'Draft' | 'Archived';
  author: string;
  duration: string;
  modulesCount: number;
  description: string;
}

const INITIAL_CONTENT: OnlineContentRecord[] = [
  {
    id: 1,
    title: 'Micro-Frontend Federation Architecture in React',
    format: 'MP4 Video',
    size: '420 MB',
    views: 1250,
    status: 'Published',
    author: 'Sophie Laurent',
    duration: '1h 45m',
    modulesCount: 6,
    description: 'High-definition video course exploring module federation, shared dependencies, and isolated runtime scopes.'
  },
  {
    id: 2,
    title: 'Enterprise SOC2 Type II Interactive Compliance Lab',
    format: 'SCORM 2004',
    size: '85 MB',
    views: 3420,
    status: 'Published',
    author: 'Security Operations',
    duration: '45m',
    modulesCount: 4,
    description: 'Interactive SCORM package containing simulated social engineering tests and device security quizzes.'
  },
  {
    id: 3,
    title: 'Executive Presentation Playbook & Template Kit',
    format: 'Interactive PDF',
    size: '34 MB',
    views: 890,
    status: 'Published',
    author: 'Chloe Bennett',
    duration: 'Self-paced',
    modulesCount: 8,
    description: 'Downloadable slide deck architectures, typographic standards, and executive pitch storytelling guides.'
  },
  {
    id: 4,
    title: 'Distributed Systems Tracing with OpenTelemetry',
    format: 'xAPI Package',
    size: '120 MB',
    views: 430,
    status: 'Draft',
    author: 'Vikram Patel',
    duration: '2h 15m',
    modulesCount: 5,
    description: 'Hands-on xAPI telemetry sandbox course for tracking distributed microservice spans and Jaeger traces.'
  }
];

export function OnlineCourses() {
  const [contentList, setContentList] = useState<OnlineContentRecord[]>(INITIAL_CONTENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<OnlineContentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredContent = useMemo(() => {
    return contentList.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.format.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFormat = formatFilter === 'All' || item.format === formatFilter;
      return matchesSearch && matchesFormat;
    });
  }, [contentList, searchTerm, formatFilter]);

  const handleTogglePublish = (id: number) => {
    setContentList(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextStatus: 'Published' | 'Draft' = c.status === 'Published' ? 'Draft' : 'Published';
      return { ...c, status: nextStatus };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: prev.status === 'Published' ? 'Draft' : 'Published'
      } : null);
    }
    showToast('Digital content status updated!');
  };

  const handleDownloadManifest = (rec: OnlineContentRecord) => {
    const content = `===============================================================
               DIGITAL LMS CONTENT PACKAGE MANIFEST
===============================================================
Title         : ${rec.title}
Format        : ${rec.format}
Author        : ${rec.author}
File Size     : ${rec.size}
Total Views   : ${rec.views} Learners
Modules Count : ${rec.modulesCount} Chapters
Status        : ${rec.status.toUpperCase()}
Exported Date : ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
---------------------------------------------------------------
SYNOPSIS & LEARNING OBJECTIVES
---------------------------------------------------------------
${rec.description}

===============================================================
Cloud CDN Endpoint: https://lms-cdn.internal.company.com/assets/${rec.id}
Package Checksum : SHA256-99214b981fcae01
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Manifest_${rec.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Content manifest downloaded for ${rec.title}`);
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
            <span>Digital Media Items</span>
            <Video className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{contentList.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Self-paced modules</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Published Packages</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {contentList.filter(i => i.status === 'Published').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Streamable on demand</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Streams / Views</span>
            <Play className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {contentList.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Learner engagements</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>SCORM & xAPI</span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {contentList.filter(i => i.format.includes('SCORM') || i.format.includes('xAPI')).length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Interactive packages</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Online & Digital Learning Content</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage self-paced interactive SCORM modules, video lectures, and learning guides</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search digital content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'MP4 Video', 'SCORM 2004', 'Interactive PDF'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  formatFilter === f 
                    ? 'bg-white text-blue-700 shadow-xs font-semibold' 
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
                <th className="px-6 py-3.5">Content Title</th>
                <th className="px-6 py-3.5">Format</th>
                <th className="px-6 py-3.5">File Size</th>
                <th className="px-6 py-3.5">Views</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No online content matches your filter.
                  </td>
                </tr>
              ) : (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">By {item.author} • {item.duration}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.format === 'MP4 Video' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.format === 'SCORM 2004' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {item.format}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-700 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        {item.size}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        {item.views.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Published' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600"/> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Inspect Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 border-blue-200 font-medium flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
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
                                Digital Content Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                Inspect Package & Chapters
                              </button>

                              <button
                                onClick={() => handleTogglePublish(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.status === 'Published' ? 'Unpublish to Draft' : 'Publish Package'}
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadManifest(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Manifest (.txt)
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
          <div>Showing {filteredContent.length} of {contentList.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredContent.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Online Content Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Format: {selectedRecord.format} • Size: {selectedRecord.size} • Author: {selectedRecord.author}
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
              {/* Stats Overview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Total Views:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedRecord.views.toLocaleString()} Views</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Playback Time:</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedRecord.duration}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Chapters Count:</span>
                  <div className="font-bold text-indigo-600 text-sm mt-0.5">{selectedRecord.modulesCount} Modules</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  Digital Course Overview
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedRecord.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadManifest(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Manifest (.txt)
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
                  onClick={() => handleTogglePublish(selectedRecord.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {selectedRecord.status === 'Published' ? 'Unpublish' : 'Publish Package'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
