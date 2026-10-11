import React from 'react';
import { Course } from '../../data/courses.js';
import {
  Calculator,
  FlaskConical,
  Binary,
  ShieldAlert,
  Layout,
  Code2,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  GraduationCap,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
  onViewDetails: (course: Course) => void;
}

const CourseIcon: React.FC<{ iconName: Course['iconName'] }> = ({ iconName }) => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className="w-5 h-5" />;
    case 'FlaskConical':
      return <FlaskConical className="w-5 h-5" />;
    case 'Binary':
      return <Binary className="w-5 h-5" />;
    case 'ShieldAlert':
      return <ShieldAlert className="w-5 h-5" />;
    case 'Layout':
      return <Layout className="w-5 h-5" />;
    case 'Code2':
    default:
      return <Code2 className="w-5 h-5" />;
  }
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSelected,
  onSelect,
  onViewDetails,
}) => {
  return (
    <div
      className={`group relative bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-lg shadow-sky-500/10'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner & Header */}
      <div className="p-6 pb-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${course.colorGradient} flex items-center justify-center text-white shadow-md shadow-sky-500/10`}
          >
            <CourseIcon iconName={course.iconName} />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Sparkles className="w-3 h-3 text-sky-600" />
              {course.badge}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {course.category}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors">
            {course.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {course.shortDescription}
          </p>
        </div>

        {/* Suitable Age / Grade Range */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <GraduationCap className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>Suitable for: <strong>{course.ageRange}</strong> ({course.grades})</span>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-6 pt-2 space-y-4">
        {/* Pricing Block */}
        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
              Course Tuition
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {course.pricing.currencySymbol}
              {course.pricing.amount}{' '}
              <span className="text-xs font-medium text-slate-500">/ class</span>
            </span>
            <span className="block text-[10px] text-slate-400">
              {course.pricing.billingPeriod}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
              Free Trial Available
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Sample catalog price</span>
          </div>
        </div>

        {/* Buttons: View Details & Book a Trial */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(course)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(course)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              isSelected
                ? 'bg-sky-600 text-white shadow-sky-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Book a Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
