import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Users, GraduationCap, BookOpen, Award, CheckCircle, BrainCircuit } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

import { CourseCatalog } from '../components/CourseCatalog';
import { LearningPaths } from '../components/LearningPaths';
import { MandatoryTraining } from '../components/MandatoryTraining';
import { EmployeeLearning } from '../components/EmployeeLearning';
import { TrainerManagement } from '../components/TrainerManagement';
import { ClassroomTraining } from '../components/ClassroomTraining';
import { OnlineCourses } from '../components/OnlineCourses';
import { Assessments } from '../components/Assessments';
import { Certifications } from '../components/Certifications';
import { SkillsMatrix } from '../components/SkillsMatrix';
import { LearningReports } from '../components/LearningReports';
import { LMSSettings } from '../components/LMSSettings';

const learningTrendData = [
  { month: 'Jan', completions: 45, hours: 120 },
  { month: 'Feb', completions: 52, hours: 145 },
  { month: 'Mar', completions: 38, hours: 90 },
  { month: 'Apr', completions: 65, hours: 180 },
  { month: 'May', completions: 85, hours: 210 },
  { month: 'Jun', completions: 92, hours: 250 },
];

const departmentData = [
  { name: 'Engineering', active: 85, completed: 420 },
  { name: 'Sales', active: 45, completed: 180 },
  { name: 'Marketing', active: 30, completed: 150 },
  { name: 'HR', active: 15, completed: 90 },
];

export function HRLearningDashboard() {
  const [stats, setStats] = useState<any>({
    totalCourses: 100,
    publishedCourses: 85,
    totalEnrollments: 1000,
    completedCourses: 450
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/learning/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data && data.totalCourses) {
          setStats(data);
        }
      })
      .catch(err => console.error('Failed to load LMS stats', err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Learning Management System</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enterprise Course Management & Skill Development</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalCourses}</div>
            <p className="text-xs text-slate-500 mt-1">{stats.publishedCourses} Published</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Enrollments</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalEnrollments}</div>
            <p className="text-xs text-slate-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Courses Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.completedCourses}</div>
            <p className="text-xs text-slate-500 mt-1">45% Completion Rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Certifications Issued</CardTitle>
            <Award className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">324</div>
            <p className="text-xs text-slate-500 mt-1">12 Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
          <TabsList className="w-max inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="mandatory">Mandatory Training</TabsTrigger>
            <TabsTrigger value="employee">Employee Learning</TabsTrigger>
            <TabsTrigger value="trainers">Trainer Management</TabsTrigger>
            <TabsTrigger value="classroom">Classroom Training</TabsTrigger>
            <TabsTrigger value="online">Online Courses</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Learning Trend</CardTitle>
                <CardDescription>Course completions vs training hours</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={learningTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="completions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCompletions)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Enrollment</CardTitle>
                <CardDescription>Active vs Completed by department</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="active" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Active Enrollment" />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="mt-6"><CourseCatalog /></TabsContent>
        <TabsContent value="paths" className="mt-6"><LearningPaths /></TabsContent>
        <TabsContent value="mandatory" className="mt-6"><MandatoryTraining /></TabsContent>
        <TabsContent value="employee" className="mt-6"><EmployeeLearning /></TabsContent>
        <TabsContent value="trainers" className="mt-6"><TrainerManagement /></TabsContent>
        <TabsContent value="classroom" className="mt-6"><ClassroomTraining /></TabsContent>
        <TabsContent value="online" className="mt-6"><OnlineCourses /></TabsContent>
        <TabsContent value="assessments" className="mt-6"><Assessments /></TabsContent>
        <TabsContent value="certifications" className="mt-6"><Certifications /></TabsContent>
        <TabsContent value="skills" className="mt-6"><SkillsMatrix /></TabsContent>
        <TabsContent value="reports" className="mt-6"><LearningReports /></TabsContent>
        <TabsContent value="settings" className="mt-6"><LMSSettings /></TabsContent>

      </Tabs>
    </div>
  );
}
