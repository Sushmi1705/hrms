import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { CategoryDataPoint } from '../api/reportApi';
import { Building2 } from 'lucide-react';

interface DepartmentHeadcountChartProps {
  data: CategoryDataPoint[];
  onSelectDepartment?: (dept: string) => void;
}


const PALETTE = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16', // Lime
  '#e11d48', // Rose
  '#64748b'  // Slate
];

export const DepartmentHeadcountChart: React.FC<DepartmentHeadcountChartProps> = ({ data, onSelectDepartment }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Headcount by Department
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise departmental staff breakdown ({data.length} active departments) • Click to filter
          </CardDescription>
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {total} Total Staff
        </span>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            No departmental data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
            {/* Donut Chart */}
            <div className="md:col-span-6 h-[260px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2.5}
                    dataKey="value"
                    nameKey="category"
                    cursor="pointer"
                    onClick={(entry: any) => onSelectDepartment?.(entry?.category || entry?.name)}
                  >

                    {sortedData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE[index % PALETTE.length]}
                        stroke="#ffffff"
                        className="dark:stroke-slate-900"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                    }}
                    formatter={(val: any, name: any) => [
                      `${val} staff (${total > 0 ? ((Number(val) / total) * 100).toFixed(1) : 0}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Donut Summary */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Employees
                </span>
              </div>
            </div>

            {/* Custom Department Legend */}
            <div className="md:col-span-6 max-h-[260px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {sortedData.map((dept, index) => {
                const pct = total > 0 ? Math.round((dept.value / total) * 100) : 0;
                return (
                  <div
                    key={dept.category}
                    onClick={() => onSelectDepartment?.(dept.category)}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                    title={`Click to drill-down to ${dept.category} staff`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {dept.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                      <span>{dept.value}</span>
                      <span className="text-slate-400 font-normal text-[11px] w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

