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
      <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-[#EDE4D5]">
        <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-charcoal-600">Calculating available mentor slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Unable to load availability</span>
        </div>
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#EDE4D5] space-y-4">
        <div className="w-12 h-12 bg-coral-50 text-coral-600 rounded-2xl flex items-center justify-center mx-auto border border-coral-200">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h4 className="text-base font-extrabold text-charcoal-900">No Slots Available for this Date</h4>
          <p className="text-xs text-charcoal-500">
            All 10 mentors have reached their daily demo capacity or have full schedules on this date.
            Please choose another day or view the suggested times below.
          </p>
        </div>

        {suggestedAlternatives.length > 0 && (
          <div className="pt-4 border-t border-[#EDE4D5]/60 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
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
                  className="p-2.5 rounded-xl border border-coral-200 bg-coral-50/50 hover:bg-coral-100/60 text-left text-xs font-semibold text-charcoal-900 transition-colors flex items-center justify-between"
                >
                  <span>
                    {alt.parentLocalDate} at {formatTimeOnly(alt.startAt, parentTimezone)}
                  </span>
                  <span className="text-[10px] text-coral-600 bg-coral-100 px-2 py-0.5 rounded-md font-bold">
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
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-coral-500" />
          Select Time Slot ({slots.length} available)
        </label>
        <span className="text-xs text-charcoal-500 font-semibold">
          30-minute 1-on-1 class
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-cream-300">
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
                  ? 'bg-gradient-to-r from-coral-500 to-terracotta text-white border-transparent shadow-warm-md ring-2 ring-coral-400 ring-offset-2 ring-offset-white'
                  : 'bg-white text-charcoal-800 border-[#EDE4D5] hover:border-coral-300 hover:shadow-warm-sm hover:bg-cream-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-extrabold block">{displayTime}</span>
                <span
                  className={`text-[10px] block mt-0.5 ${
                    isSelected ? 'text-coral-100' : 'text-charcoal-400'
                  }`}
                >
                  Mentor: {mentorTime}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white font-medium'
                      : 'bg-cream-100 text-charcoal-600 group-hover:bg-coral-50 group-hover:text-coral-700'
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
