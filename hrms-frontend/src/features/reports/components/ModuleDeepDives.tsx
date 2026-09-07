import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { reportsApi } from '../api/reportApi';
import type { RecruitmentAnalyticsDto, PerformanceAnalyticsDto, TrainingAnalyticsDto } from '../api/reportApi';
import {
  Briefcase,
  Award,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';

export const ModuleDeepDives: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recruitment' | 'performance' | 'training'>('recruitment');
  const [recruitment, setRecruitment] = useState<RecruitmentAnalyticsDto | null>(null);
  const [performance, setPerformance] = useState<PerformanceAnalyticsDto | null>(null);
  const [training, setTraining] = useState<TrainingAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTab = async () => {
      setLoading(true);
      try {
        if (activeTab === 'recruitment' && !recruitment) {
          const res = await reportsApi.getRecruitmentAnalytics();
          setRecruitment(res);
        } else if (activeTab === 'performance' && !performance) {
          const res = await reportsApi.getPerformanceAnalytics();
          setPerformance(res);
        } else if (activeTab === 'training' && !training) {
          const res = await reportsApi.getTrainingAnalytics();
          setTraining(res);
        }
      } catch (e) {
        console.error('Failed to load module analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTab();
  }, [activeTab]);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Specialized Departmental Deep Dives
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Granular analytics into ATS talent acquisition, performance reviews, and LMS learning
          </CardDescription>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('recruitment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'recruitment'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Recruitment</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'performance'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Star className="h-3.5 w-3.5" />
            <span>Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'training'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Learning &amp; LMS</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
            <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-2" />
            Loading specialized analytics...
          </div>
        ) : (
          <div>
            {/* Recruitment Tab */}
            {activeTab === 'recruitment' && recruitment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Applicants</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {recruitment.totalApplications}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Offers Extended</span>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {recruitment.offersExtended}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Offer Acceptance</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {recruitment.offerAcceptanceRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Avg Time-to-Hire</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {recruitment.timeToHireDays} days
                    </p>
                  </div>
                </div>

                {/* Openings by Department */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Open Requisitions by Department
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {recruitment.openingsByDepartment.map((item) => (
                      <div
                        key={item.category}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          {item.category}
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.value} openings
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && performance && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Reviews</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {performance.totalReviews}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Completed Reviews</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {performance.completedReviews}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Pending Reviews</span>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {performance.pendingReviews}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Avg Rating Score</span>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {performance.averageCompanyRating} / 5.0
                    </p>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Performance Score Distribution
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {performance.ratingDistribution.map((item, idx) => (
                      <div
                        key={item.category}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          {item.category}
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.value} reviews
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Training Tab */}
            {activeTab === 'training' && training && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Active Courses</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {training.totalCourses}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Enrollments</span>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {training.totalEnrollments}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Completion Rate</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {training.completionRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Training Hrs/Employee</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {training.averageHoursPerEmployee} hrs
                    </p>
                  </div>
                </div>

                {/* Popular Courses */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Top Enrolled Learning Paths
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {training.popularCourses.map((item) => (
                      <div
                        key={item.category}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center"
                      >
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate mr-2">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {item.value} enrolled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
