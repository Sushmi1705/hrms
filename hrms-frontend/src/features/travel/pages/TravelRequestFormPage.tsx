import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plane, ArrowLeft, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { createTravelRequest, updateTravelRequest, getTravelRequest } from '../api/travelApi';
import type { CreateTravelRequestDto } from '../types/travel';
import { TRAVEL_TYPES } from '../types/travel';

const defaultForm: CreateTravelRequestDto = {
  purpose: '', businessJustification: '', travelType: 'Domestic',
  origin: '', destination: '', departureDate: '', returnDate: '',
  estimatedCost: 0, currency: 'USD', advanceRequired: false, notes: '',
};

export function TravelRequestFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState<CreateTravelRequestDto>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTravelRequestDto, string>>>({});

  const { isLoading: loadingExisting, data: existingData } = useQuery({
    queryKey: ['travel-request', id],
    queryFn: () => getTravelRequest(id!),
    enabled: isEdit,
  });

  // Populate form when existing data is loaded
  React.useEffect(() => {
    if (existingData) {
      setForm({ ...existingData, departureDate: existingData.departureDate.slice(0, 10), returnDate: existingData.returnDate.slice(0, 10) });
    }
  }, [existingData]);

  const mut = useMutation({
    mutationFn: isEdit ? (dto: CreateTravelRequestDto) => updateTravelRequest(id!, dto) : createTravelRequest,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['travel-requests'] });
      navigate(`/travel/requests/${data.id}`);
    },
  });

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.purpose.trim()) e.purpose = 'Purpose is required';
    if (!form.origin.trim()) e.origin = 'Origin is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.departureDate) e.departureDate = 'Departure date is required';
    if (!form.returnDate) e.returnDate = 'Return date is required';
    if (form.returnDate < form.departureDate) e.returnDate = 'Return must be after departure';
    if (form.estimatedCost <= 0) e.estimatedCost = 'Estimated cost must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) mut.mutate(form);
  };

  const set = (field: keyof CreateTravelRequestDto) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked
      : e.target.type === 'number' ? parseFloat(e.target.value) || 0
      : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (isEdit && loadingExisting) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plane className="text-blue-400 w-6 h-6" />
              {isEdit ? 'Edit Travel Request' : 'New Travel Request'}
            </h1>
            <p className="text-slate-400 text-sm">Fill in the details for your business trip</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Details */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" /> Trip Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Purpose *</label>
                <input value={form.purpose} onChange={set('purpose')} placeholder="Business meeting, conference, client visit..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${errors.purpose ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                {errors.purpose && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.purpose}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Travel Type *</label>
                <select value={form.travelType} onChange={set('travelType')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50">
                  {TRAVEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency</label>
                <select value={form.currency} onChange={set('currency')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50">
                  {['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD', 'AUD', 'CAD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Origin *</label>
                <input value={form.origin} onChange={set('origin')} placeholder="Departure city/airport"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${errors.origin ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                {errors.origin && <p className="text-red-400 text-xs mt-1"><AlertTriangle className="w-3 h-3 inline" /> {errors.origin}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Destination *</label>
                <input value={form.destination} onChange={set('destination')} placeholder="Arrival city/airport"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${errors.destination ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                {errors.destination && <p className="text-red-400 text-xs mt-1"><AlertTriangle className="w-3 h-3 inline" /> {errors.destination}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Departure Date *</label>
                <input type="date" value={form.departureDate} onChange={set('departureDate')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark] ${errors.departureDate ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                {errors.departureDate && <p className="text-red-400 text-xs mt-1"><AlertTriangle className="w-3 h-3 inline" /> {errors.departureDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Return Date *</label>
                <input type="date" value={form.returnDate} onChange={set('returnDate')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark] ${errors.returnDate ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                {errors.returnDate && <p className="text-red-400 text-xs mt-1"><AlertTriangle className="w-3 h-3 inline" /> {errors.returnDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Estimated Cost *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{form.currency}</span>
                  <input type="number" min={0} step={0.01} value={form.estimatedCost} onChange={set('estimatedCost')}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/60 border text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${errors.estimatedCost ? 'border-red-500/50' : 'border-slate-700/50'}`} />
                </div>
                {errors.estimatedCost && <p className="text-red-400 text-xs mt-1"><AlertTriangle className="w-3 h-3 inline" /> {errors.estimatedCost}</p>}
              </div>
            </div>
          </div>

          {/* Business Justification */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-slate-200 font-semibold mb-4">Business Justification</h2>
            <textarea value={form.businessJustification} onChange={set('businessJustification')} rows={3}
              placeholder="Explain the business need for this trip..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>

          {/* Advance */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-slate-200 font-semibold mb-4">Travel Advance</h2>
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" id="advance" checked={form.advanceRequired} onChange={set('advanceRequired')} className="w-4 h-4 rounded border-slate-600 accent-blue-500" />
              <label htmlFor="advance" className="text-slate-300 text-sm">I require a travel advance</label>
            </div>
            {form.advanceRequired && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Advance Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{form.currency}</span>
                  <input type="number" min={0} step={0.01} value={form.advanceAmount ?? 0} onChange={set('advanceAmount')}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-slate-200 font-semibold mb-4">Additional Notes</h2>
            <textarea value={form.notes} onChange={set('notes')} rows={2}
              placeholder="Any additional information..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-200 text-sm font-medium transition-all">
              Cancel
            </button>
            <button type="submit" disabled={mut.isPending}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
              {mut.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> {isEdit ? 'Update Request' : 'Create Request'}</>}
            </button>
          </div>

          {mut.isError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Failed to save travel request. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
