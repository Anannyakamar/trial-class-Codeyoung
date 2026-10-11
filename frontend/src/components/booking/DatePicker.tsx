import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  disabled = false,
}) => {
  // Generate next 14 days starting today
  const today = new Date();
  const dates: { dateString: string; label: string; dayName: string; dayNumber: string }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    dates.push({
      dateString,
      label: `${dayName}, ${dayNumber}`,
      dayName,
      dayNumber,
    });
  }

  const handlePrevDay = () => {
    const currentIndex = dates.findIndex((d) => d.dateString === selectedDate);
    if (currentIndex > 0) {
      onChange(dates[currentIndex - 1].dateString);
    }
  };

  const handleNextDay = () => {
    const currentIndex = dates.findIndex((d) => d.dateString === selectedDate);
    if (currentIndex < dates.length - 1) {
      onChange(dates[currentIndex + 1].dateString);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-sky-600" />
          Select Date
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevDay}
            disabled={disabled || selectedDate === dates[0]?.dateString}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500">14-Day View</span>
          <button
            type="button"
            onClick={handleNextDay}
            disabled={disabled || selectedDate === dates[dates.length - 1]?.dateString}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Date Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-200">
        {dates.map((item) => {
          const isSelected = item.dateString === selectedDate;
          return (
            <button
              key={item.dateString}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.dateString)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[84px] py-2.5 px-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/25 ring-2 ring-sky-500 ring-offset-2'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                {item.dayName}
              </span>
              <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                {item.dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
