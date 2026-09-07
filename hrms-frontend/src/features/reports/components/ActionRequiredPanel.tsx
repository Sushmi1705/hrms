import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { ActionItemDto } from '../api/reportApi';
import { AlertCircle, ChevronRight, Clock, ShieldAlert } from 'lucide-react';

interface ActionRequiredPanelProps {
  actionItems: ActionItemDto[];
}

export const ActionRequiredPanel: React.FC<ActionRequiredPanelProps> = ({ actionItems }) => {
  const navigate = useNavigate();

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60';
    }
  };

  const totalPending = actionItems.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Operational Attention Required
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bottlenecks and pending operational approvals requiring executive attention
          </CardDescription>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {totalPending} Items Pending
        </span>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3">
          {actionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.actionUrl)}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center font-bold text-base text-slate-900 dark:text-white shadow-xs shrink-0 group-hover:border-indigo-300">
                  {item.count}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs px-2.5 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 gap-1"
              >
                <span>Resolve</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
