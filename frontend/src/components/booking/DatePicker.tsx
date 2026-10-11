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
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-coral-500" />
          Select Date
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevDay}
            disabled={disabled || selectedDate === dates[0]?.dateString}
            className="p-1.5 rounded-xl hover:bg-cream-200 text-charcoal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-[#EDE4D5]/60"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-charcoal-500 px-1">14-Day View</span>
          <button
            type="button"
            onClick={handleNextDay}
            disabled={disabled || selectedDate === dates[dates.length - 1]?.dateString}
            className="p-1.5 rounded-xl hover:bg-cream-200 text-charcoal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-[#EDE4D5]/60"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Date Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-cream-300">
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
                  ? 'bg-coral-500 text-white border-coral-500 shadow-warm-sm ring-2 ring-coral-400 ring-offset-2 ring-offset-white'
                  : 'bg-white text-charcoal-700 border-[#EDE4D5] hover:border-coral-300 hover:bg-cream-50'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-coral-100' : 'text-charcoal-500'}`}>
                {item.dayName}
              </span>
              <span className={`text-sm font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-charcoal-900'}`}>
                {item.dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
