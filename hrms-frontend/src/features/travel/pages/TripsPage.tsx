import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plane, Clock, CheckCircle, Calendar, DollarSign, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { getTrips, getTrip, addItineraryItem } from '../api/travelApi';
import type { CreateItineraryItemDto } from '../types/travel';
import { ITINERARY_TYPES } from '../types/travel';
import { format, differenceInDays } from 'date-fns';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    InProgress: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Completed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Cancelled: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] ?? 'bg-slate-700/20 text-slate-400'}`}>{status}</span>;
};

const defaultItinerary: CreateItineraryItemDto = {
  type: 'Flight', provider: '', bookingReference: '', origin: '', destination: '',
  startDateTime: '', endDateTime: '', cost: 0, currency: 'USD', notes: '',
};

export function TripsPage() {
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingItineraryTo, setAddingItineraryTo] = useState<string | null>(null);
  const [itineraryForm, setItineraryForm] = useState<CreateItineraryItemDto>(defaultItinerary);

  const { data: trips = [], isLoading } = useQuery({ queryKey: ['trips'], queryFn: getTrips, staleTime: 30000 });

  const { data: tripDetail } = useQuery({
    queryKey: ['trip', expandedId],
    queryFn: () => getTrip(expandedId!),
    enabled: !!expandedId,
    staleTime: 30000,
  });

  const addItineraryMut = useMutation({
    mutationFn: ({ tripId, dto }: { tripId: string; dto: CreateItineraryItemDto }) => addItineraryItem(tripId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip', addingItineraryTo] });
      setAddingItineraryTo(null);
      setItineraryForm(defaultItinerary);
    }
  });

  const typeIcons: Record<string, string> = {
    Flight: '✈️', Hotel: '🏨', Train: '🚂', 'Car Rental': '🚗', Taxi: '🚕', Bus: '🚌', Ferry: '⛴️', Other: '📍'
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="text-purple-400 w-6 h-6" /> My Trips
        </h1>
        <p className="text-slate-400 text-sm mt-1">{trips.length} trips</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Upcoming', count: trips.filter(t => t.status === 'Upcoming').length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'In Progress', count: trips.filter(t => t.status === 'InProgress').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Completed', count: trips.filter(t => t.status === 'Completed').length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(card => (
          <div key={card.label} className={`rounded-2xl border ${card.bg} p-4 flex items-center gap-3`}>
            <MapPin className={`w-6 h-6 ${card.color}`} />
            <div>
              <p className="text-xl font-bold text-white">{card.count}</p>
              <p className="text-slate-400 text-xs">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <MapPin className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">No trips yet</p>
          <p className="text-sm">Trips are created when a travel request is approved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => {
            const nights = differenceInDays(new Date(trip.returnDate), new Date(trip.departureDate));
            const isExpanded = expandedId === trip.id;
            const savings = trip.estimatedCost - trip.actualCost;
            return (
              <div key={trip.id} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all">
                {/* Trip Header */}
                <button onClick={() => setExpandedId(isExpanded ? null : trip.id)} className="w-full p-5 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-slate-200 font-semibold">{trip.destination}</h3>
                          <StatusBadge status={trip.status} />
                          <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">{trip.travelType}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-0.5">{trip.employeeName} · {trip.department}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1">
                          <span className="text-slate-500 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {format(new Date(trip.departureDate), 'MMM d')} – {format(new Date(trip.returnDate), 'MMM d, yyyy')} ({nights}n)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">Est: ${trip.estimatedCost.toLocaleString()}</p>
                        {trip.actualCost > 0 && (
                          <p className={`text-xs ${savings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            Act: ${trip.actualCost.toLocaleString()} {savings >= 0 ? `(saved $${savings.toLocaleString()})` : `(over by $${Math.abs(savings).toLocaleString()})`}
                          </p>
                        )}
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>
                </button>

                {/* Trip Detail - Itinerary */}
                {isExpanded && (
                  <div className="border-t border-slate-700/50 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-slate-300 font-medium text-sm">Itinerary</h4>
                      <button onClick={() => setAddingItineraryTo(trip.id)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/40 text-xs transition-all">
                        + Add Item
                      </button>
                    </div>
                    {(!tripDetail?.itineraryItems || tripDetail.itineraryItems.length === 0) ? (
                      <p className="text-slate-500 text-sm text-center py-4">No itinerary items. Click "+ Add Item" to add flights, hotels, etc.</p>
                    ) : (
                      <div className="space-y-2">
                        {tripDetail.itineraryItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                            <span className="text-xl">{typeIcons[item.type] ?? '📍'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-200 text-sm font-medium">{item.provider} {item.bookingReference && `· #${item.bookingReference}`}</p>
                              <p className="text-slate-400 text-xs">{item.origin} → {item.destination} · {format(new Date(item.startDateTime), 'MMM d, HH:mm')}</p>
                            </div>
                            <span className="text-slate-300 text-sm font-medium shrink-0">{item.currency} {item.cost.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Itinerary Form */}
                    {addingItineraryTo === trip.id && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-purple-500/20">
                        <h5 className="text-slate-300 font-medium text-sm mb-3">Add Itinerary Item</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <select value={itineraryForm.type} onChange={e => setItineraryForm(f => ({ ...f, type: e.target.value }))}
                            className="col-span-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50">
                            {ITINERARY_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <input placeholder="Provider" value={itineraryForm.provider} onChange={e => setItineraryForm(f => ({ ...f, provider: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
                          <input placeholder="Booking Reference" value={itineraryForm.bookingReference} onChange={e => setItineraryForm(f => ({ ...f, bookingReference: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
                          <input placeholder="Origin" value={itineraryForm.origin} onChange={e => setItineraryForm(f => ({ ...f, origin: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
                          <input placeholder="Destination" value={itineraryForm.destination} onChange={e => setItineraryForm(f => ({ ...f, destination: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500/50" />
                          <input type="datetime-local" value={itineraryForm.startDateTime} onChange={e => setItineraryForm(f => ({ ...f, startDateTime: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50 [color-scheme:dark]" />
                          <input type="datetime-local" value={itineraryForm.endDateTime} onChange={e => setItineraryForm(f => ({ ...f, endDateTime: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50 [color-scheme:dark]" />
                          <input type="number" placeholder="Cost" value={itineraryForm.cost} onChange={e => setItineraryForm(f => ({ ...f, cost: parseFloat(e.target.value) || 0 }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50" />
                          <select value={itineraryForm.currency} onChange={e => setItineraryForm(f => ({ ...f, currency: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50">
                            {['USD', 'EUR', 'GBP', 'INR', 'AED'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <button onClick={() => { setAddingItineraryTo(null); setItineraryForm(defaultItinerary); }}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs">Cancel</button>
                          <button onClick={() => addItineraryMut.mutate({ tripId: trip.id, dto: itineraryForm })}
                            disabled={addItineraryMut.isPending}
                            className="flex-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs disabled:opacity-50">
                            {addItineraryMut.isPending ? 'Adding...' : 'Add Item'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
