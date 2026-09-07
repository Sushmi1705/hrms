import React from 'react';
import { ShieldAlert, LogOut, Lock } from 'lucide-react';
import { ImpersonationSessionResult } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  session: ImpersonationSessionResult | null;
  onExit: () => void;
}

export const ImpersonationBanner: React.FC<Props> = ({ session, onExit }) => {
  if (!session) return null;

  const handleExit = async () => {
    try {
      await tenantApi.endImpersonation(session.logId, 'Administrative session exited');
      onExit();
    } catch (err) {
      onExit();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white px-6 py-2.5 shadow-lg flex items-center justify-between text-xs font-semibold z-50 animate-in slide-in-from-top duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span>IMPERSONATION ACTIVE: </span>
          <span className="font-bold underline ml-1">{session.tenantName} ({session.tenantCode})</span>
          <span className="opacity-80 ml-2 hidden sm:inline">• All actions are forensically recorded in SaaS Platform Security Audit</span>
        </div>
      </div>

      <button
        onClick={handleExit}
        className="px-3 py-1 bg-white text-rose-700 hover:bg-white/90 rounded-lg shadow-sm font-bold flex items-center gap-1.5 transition-all text-xs"
      >
        <LogOut className="w-3.5 h-3.5" />
        Exit Impersonation
      </button>
    </div>
  );
};
