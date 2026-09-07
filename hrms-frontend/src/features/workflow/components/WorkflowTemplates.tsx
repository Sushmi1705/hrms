import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  FileText,
  Calendar,
  Clock,
  CreditCard,
  Briefcase,
  Laptop,
  Award,
  TrendingUp,
  UserMinus,
  ShieldCheck,
  Plus,
  Sparkles,
  ArrowRight,
  Layers,
  RefreshCw
} from 'lucide-react';
import { WorkflowTemplate, WorkflowDefinition } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface WorkflowTemplatesProps {
  onTemplateInstantiated: (workflow: WorkflowDefinition) => void;
}

export function WorkflowTemplates({ onTemplateInstantiated }: WorkflowTemplatesProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [instantiatingId, setInstantiatingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    workflowApi
      .getTemplates()
      .then((res) => setTemplates(res))
      .catch((err) => console.error('Failed to load templates', err))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (id: string) => {
    try {
      setInstantiatingId(id);
      const created = await workflowApi.instantiateTemplate(id);
      onTemplateInstantiated(created);
    } catch (err: any) {
      alert(err.message || 'Failed to instantiate template');
    } finally {
      setInstantiatingId(null);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-500" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-purple-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'UserMinus':
        return <UserMinus className="w-5 h-5 text-rose-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-teal-500" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  const categories = ['All', 'Core HR', 'Finance', 'Operations', 'Talent', 'IT'];

  const filtered = selectedCategory === 'All' ? templates : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">Loading enterprise template gallery...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => (
            <Card
              key={tpl.id}
              className="shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                    {getIcon(tpl.icon)}
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {tpl.category}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {tpl.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {tpl.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {tpl.usageCount} organizations deployed
                  </span>

                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(tpl.id)}
                    disabled={instantiatingId === tpl.id}
                    className="text-xs bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 h-8"
                  >
                    {instantiatingId === tpl.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
