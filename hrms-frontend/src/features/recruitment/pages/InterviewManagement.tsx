import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Calendar, Clock, Video, CheckCircle2, Star, User, 
  Plus, MessageSquare, X, ExternalLink, ShieldCheck, 
  Filter, Search
} from 'lucide-react';

export interface ScheduledInterview {
  id: number;
  candidate: string;
  role: string;
  round: string;
  date: string;
  time: string;
  duration: string;
  panel: string;
  meetingPlatform: 'Microsoft Teams' | 'Google Meet' | 'Zoom';
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Feedback Pending' | 'Cancelled';
  feedback?: {
    technicalRating: number;
    culturalRating: number;
    recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
    comments: string;
  };
}

const INITIAL_INTERVIEWS: ScheduledInterview[] = [
  { 
    id: 1, 
    candidate: 'Michael Chen', 
    role: 'Backend Eng.', 
    round: 'Technical Round 1 (System Design)', 
    date: 'Today', 
    time: '2:00 PM - 3:00 PM',
    duration: '60 min', 
    panel: 'Alice Cooper (VP Eng)', 
    meetingPlatform: 'Microsoft Teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/recruitment-chen-101',
    status: 'Scheduled' 
  },
  { 
    id: 2, 
    candidate: 'Sarah Jenkins', 
    role: 'Product Mgr', 
    round: 'HR & Executive Final', 
    date: 'Tomorrow', 
    time: '11:00 AM - 11:45 AM',
    duration: '45 min', 
    panel: 'Bob Smith (HR Director)', 
    meetingPlatform: 'Google Meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'Scheduled' 
  },
  { 
    id: 3, 
    candidate: 'David Wilson', 
    role: 'Frontend Dev', 
    round: 'Technical Coding Challenge', 
    date: 'Yesterday', 
    time: '4:00 PM - 5:00 PM',
    duration: '60 min', 
    panel: 'Marcus Vance (Tech Lead)', 
    meetingPlatform: 'Google Meet',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
    status: 'Completed',
    feedback: {
      technicalRating: 5,
      culturalRating: 4,
      recommendation: 'Strong Hire',
      comments: 'Excellent mastery of React rendering cycle and TypeScript generics. Fast problem solver.'
    }
  }
];

export function InterviewManagement() {
  const [interviews, setInterviews] = useState<ScheduledInterview[]>(INITIAL_INTERVIEWS);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  // Modals
  const [feedbackInterview, setFeedbackInterview] = useState<ScheduledInterview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState<{
    technicalRating: number;
    culturalRating: number;
    recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
    comments: string;
  }>({
    technicalRating: 5,
    culturalRating: 4,
    recommendation: 'Hire',
    comments: ''
  });

  // New Interview form state
  const [newInterview, setNewInterview] = useState({
    candidate: '',
    role: 'Backend Eng.',
    round: 'Technical Round 1',
    date: 'Tomorrow',
    time: '3:00 PM - 4:00 PM',
    duration: '60 min',
    panel: 'Alice Cooper',
    meetingPlatform: 'Google Meet' as const,
    meetingLink: 'https://meet.google.com/new-interview'
  });

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleOpenFeedback = (interview: ScheduledInterview) => {
    setFeedbackInterview(interview);
    if (interview.feedback) {
      setFeedbackForm({
        technicalRating: interview.feedback.technicalRating,
        culturalRating: interview.feedback.culturalRating,
        recommendation: interview.feedback.recommendation,
        comments: interview.feedback.comments
      });
    } else {
      setFeedbackForm({
        technicalRating: 4,
        culturalRating: 4,
        recommendation: 'Hire',
        comments: ''
      });
    }
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInterview) return;

    setInterviews(prev => prev.map(item => {
      if (item.id === feedbackInterview.id) {
        return {
          ...item,
          status: 'Completed',
          feedback: {
            technicalRating: feedbackForm.technicalRating,
            culturalRating: feedbackForm.culturalRating,
            recommendation: feedbackForm.recommendation,
            comments: feedbackForm.comments || 'Evaluated and scorecard submitted.'
          }
        };
      }
      return item;
    }));

    showToast('Feedback Submitted', `Interview scorecard saved for ${feedbackInterview.candidate}.`);
    setFeedbackInterview(null);
  };

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterview.candidate) return;

    const item: ScheduledInterview = {
      id: Date.now(),
      candidate: newInterview.candidate,
      role: newInterview.role,
      round: newInterview.round,
      date: newInterview.date,
      time: newInterview.time,
      duration: newInterview.duration,
      panel: newInterview.panel,
      meetingPlatform: newInterview.meetingPlatform,
      meetingLink: newInterview.meetingLink,
      status: 'Scheduled'
    };

    setInterviews([item, ...interviews]);
    setIsScheduleModalOpen(false);
    showToast('Interview Scheduled', `${item.round} booked for ${item.candidate}.`);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Interview Management & Scorecards
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {interviews.length} Scheduled
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Conduct virtual candidate panels, join meeting bridges, and submit structured evaluation scorecards.
          </p>
        </div>

        <Button 
          onClick={() => setIsScheduleModalOpen(true)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 text-xs"
        >
          <Calendar className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Grid of Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map(i => (
          <Card key={i.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{i.candidate}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{i.role}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    i.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {i.status}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {i.round}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{i.date} ({i.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {i.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Panel: {i.panel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-medium text-slate-800">{i.meetingPlatform}</span>
                  </div>
                </div>

                {i.feedback && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl mb-4 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-800">Recommendation:</span>
                      <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {i.feedback.recommendation}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] italic">"{i.feedback.comments}"</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button 
                  onClick={() => {
                    showToast('Opening Video Bridge', `Launching ${i.meetingPlatform} meeting call`);
                    window.open(i.meetingLink, '_blank');
                  }}
                  className="flex-1 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 font-semibold"
                >
                  Join Call
                </Button>
                <Button 
                  onClick={() => handleOpenFeedback(i)} 
                  variant="outline" 
                  className="flex-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  {i.feedback ? 'View Feedback' : 'Submit Feedback'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: Interview Scorecard / Feedback */}
      {feedbackInterview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm">Interviewer Feedback Scorecard</h3>
                  <p className="text-xs text-slate-400">{feedbackInterview.candidate} • {feedbackInterview.round}</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackInterview(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Ability (1-5)</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, technicalRating: star })}
                      className={`p-1.5 rounded-lg border text-sm font-bold ${
                        feedbackForm.technicalRating >= star
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hiring Recommendation</label>
                <select
                  value={feedbackForm.recommendation}
                  onChange={e => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                >
                  <option value="Strong Hire">Strong Hire (Top 5%)</option>
                  <option value="Hire">Hire (Meets standard)</option>
                  <option value="Hold">Hold (Needs second review)</option>
                  <option value="Reject">Reject (Does not meet bar)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interviewer Notes & Evaluation</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  placeholder="Summarize candidate technical performance, strengths, and concerns..."
                  value={feedbackForm.comments}
                  onChange={e => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFeedbackInterview(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Scorecard
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Interview */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-sm">Schedule Candidate Interview</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Name *</label>
                <Input
                  required
                  placeholder="e.g. Jordan Lee"
                  value={newInterview.candidate}
                  onChange={e => setNewInterview({ ...newInterview, candidate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <Input
                    placeholder="e.g. Frontend Dev"
                    value={newInterview.role}
                    onChange={e => setNewInterview({ ...newInterview, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Round</label>
                  <Input
                    placeholder="e.g. System Design Round"
                    value={newInterview.round}
                    onChange={e => setNewInterview({ ...newInterview, round: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <Input
                    placeholder="e.g. Thursday, Sep 10"
                    value={newInterview.date}
                    onChange={e => setNewInterview({ ...newInterview, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <Input
                    placeholder="e.g. 2:00 PM - 3:00 PM"
                    value={newInterview.time}
                    onChange={e => setNewInterview({ ...newInterview, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Panel Interviewer</label>
                  <Input
                    placeholder="e.g. Marcus Vance (Tech Lead)"
                    value={newInterview.panel}
                    onChange={e => setNewInterview({ ...newInterview, panel: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Video Platform</label>
                  <select
                    value={newInterview.meetingPlatform}
                    onChange={e => setNewInterview({ ...newInterview, meetingPlatform: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Zoom">Zoom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Confirm & Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
