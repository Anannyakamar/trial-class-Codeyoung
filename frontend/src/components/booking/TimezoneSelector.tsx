import React from 'react';
import { Globe2, Clock } from 'lucide-react';
import { COMMON_TIMEZONES } from '../../utils/timezone.js';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
        Your Timezone
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coral-500">
          <Globe2 className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 bg-cream-50 border border-[#EDE4D5] rounded-2xl text-sm font-medium text-charcoal-800 shadow-warm-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
          {!COMMON_TIMEZONES.some((t) => t.value === value) && (
            <option value={value}>{value}</option>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-charcoal-400">
          <Clock className="w-4 h-4" />
        </div>
      </div>
      <p className="text-xs text-charcoal-500 flex items-center gap-1">
        <span>Available trial slots automatically convert to your local wall-clock time.</span>
      </p>
    </div>
  );
};
