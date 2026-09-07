import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { InsightItemDto } from '../api/reportApi';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface HrInsightsPanelProps {
  insights: InsightItemDto[];
}

export const HrInsightsPanel: React.FC<HrInsightsPanelProps> = ({ insights }) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40';
      default:
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/40';
    }
  };

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Strategic HR &amp; BI Insights
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated intelligence synthesized from real-time workforce, payroll, and ATS records
          </CardDescription>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI Active
        </span>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(insight.type)}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {insight.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                      insight.type
                    )}`}
                  >
                    {insight.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {insight.description}
                </p>
              </div>

              {insight.actionUrl && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Impact: <span className="font-semibold text-slate-700 dark:text-slate-300">{insight.impact}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insight.actionUrl && navigate(insight.actionUrl)}
                    className="h-7 text-xs px-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 gap-1 font-semibold"
                  >
                    <span>{insight.actionText}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
