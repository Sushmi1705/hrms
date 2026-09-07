import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise HRMS</h1>
          <p className="text-slate-500 mt-2">Select your role to enter the appropriate portal.</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => navigate('/super-admin')}
          >
            <Shield className="w-6 h-6 mr-4 text-slate-700" />
            Super Admin Portal
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => navigate('/admin')}
          >
            <Briefcase className="w-6 h-6 mr-4 text-slate-700" />
            HR / Admin Portal
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => navigate('/manager')}
          >
            <Users className="w-6 h-6 mr-4 text-slate-700" />
            Manager Portal
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-16 justify-start text-lg px-6 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => navigate('/employee')}
          >
            <User className="w-6 h-6 mr-4 text-slate-700" />
            Employee Self-Service
          </Button>
        </div>
      </div>
    </div>
  );
}
