import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, MapPin, Building, Briefcase, 
  ExternalLink, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { ColleagueDirectoryItem } from '../types/ess';

export const EmployeeDirectoryPage: React.FC = () => {
  const [colleagues, setColleagues] = useState<ColleagueDirectoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDirectory = (searchTerm?: string) => {
    setLoading(true);
    essApi.getDirectory(searchTerm)
      .then(res => setColleagues(res || []))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load colleague directory');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDirectory(search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Colleague Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with coworkers across corporate departments and office locations
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, department, role..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl" />
          ))}
        </div>
      ) : colleagues.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No colleagues found matching "{search}".</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleagues.map(c => (
            <Card key={c.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={c.avatarUrl} 
                    alt={c.fullName}
                    className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-0.5 border border-indigo-100 dark:border-indigo-900"
                  />
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[170px]">{c.fullName}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[170px]">{c.designation}</p>
                    <p className="text-[11px] text-slate-500">{c.employeeNumber}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.department}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${c.workEmail}`} className="truncate hover:text-indigo-600 hover:underline">
                      {c.workEmail}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
