import React from 'react';
import { Globe, Clock } from 'lucide-react';
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
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
        Your Timezone
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Globe className="w-4 h-4 text-sky-600" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <span>All slot times below will automatically display in this timezone.</span>
      </p>
    </div>
  );
};
