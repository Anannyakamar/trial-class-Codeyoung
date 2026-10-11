import React from 'react';
import { BookableSlot } from '../../api/client.js';
import { Clock, Users, AlertCircle, Sparkles } from 'lucide-react';
import { formatTimeOnly } from '../../utils/timezone.js';

interface SlotGridProps {
  slots: BookableSlot[];
  selectedSlot: BookableSlot | null;
  onSelectSlot: (slot: BookableSlot) => void;
  loading: boolean;
  error: string | null;
  parentTimezone: string;
  onSelectAlternativeDate?: (dateString: string) => void;
  suggestedAlternatives?: BookableSlot[];
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  error,
  parentTimezone,
  onSelectAlternativeDate,
  suggestedAlternatives = [],
}) => {
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Calculating available mentor slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Unable to load availability</span>
        </div>
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h4 className="text-base font-bold text-slate-800">No Slots Available for this Date</h4>
          <p className="text-xs text-slate-500">
            All 10 mentors have reached their daily demo capacity or have full schedules on this date.
            Please choose another day or view the suggested times below.
          </p>
        </div>

        {suggestedAlternatives.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Suggested Alternative Slots
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {suggestedAlternatives.map((alt) => (
                <button
                  key={alt.startAt}
                  type="button"
                  onClick={() => {
                    if (onSelectAlternativeDate) {
                      onSelectAlternativeDate(alt.parentLocalDate);
                    }
                    onSelectSlot(alt);
                  }}
                  className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-left text-xs font-medium text-sky-900 transition-colors flex items-center justify-between"
                >
                  <span>
                    {alt.parentLocalDate} at {formatTimeOnly(alt.startAt, parentTimezone)}
                  </span>
                  <span className="text-[10px] text-sky-600 bg-sky-200/60 px-1.5 py-0.5 rounded-md">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-600" />
          Select Time Slot ({slots.length} available)
        </label>
        <span className="text-xs text-slate-500 font-medium">
          30-minute 1-on-1 class
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.startAt === slot.startAt;
          const displayTime = formatTimeOnly(slot.startAt, parentTimezone);
          const mentorTime = `${slot.mentorLocalTime} IST`;

          return (
            <button
              key={slot.startAt}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`p-3 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-600 to-indigo-600 text-white border-transparent shadow-lg shadow-sky-600/20 ring-2 ring-sky-500 ring-offset-2'
                  : 'bg-white text-slate-800 border-slate-200/90 hover:border-sky-300 hover:shadow-sm'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">{displayTime}</span>
                <span
                  className={`text-[10px] block mt-0.5 ${
                    isSelected ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  Mentor: {mentorTime}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  {slot.availableMentorsCount} {slot.availableMentorsCount === 1 ? 'mentor' : 'mentors'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
