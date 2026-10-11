import React from 'react';
import { Course } from '../../data/courses.js';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  GraduationCap,
  Clock,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
  onViewDetails: (course: Course) => void;
}

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
          ? 'border-coral-500 ring-2 ring-coral-500/20 shadow-warm-md'
          : 'border-[#EDE4D5] hover:border-coral-300 hover:shadow-warm-lg hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Course Cover Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF8F5] border-b border-[#EDE4D5]/60">
          <img
            src={course.coverImage}
            alt={`${course.name} Course Illustration`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />

          {/* Top Badge Overlay */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/95 border ${course.badgeBg} ${course.badgeText}`}
            >
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>{course.badge}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-charcoal-900/80 text-white backdrop-blur-md">
              {course.category}
            </span>
          </div>
        </div>

        {/* Card Body & Information */}
        <div className="p-6 space-y-3.5">
          <h3 className="text-xl font-display font-extrabold text-charcoal-900 tracking-tight group-hover:text-coral-600 transition-colors">
            {course.name}
          </h3>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed line-clamp-2">
            {course.shortDescription}
          </p>

          {/* Age Group & Class Format Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-cream-100 border border-[#EDE4D5] text-charcoal-700 font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-coral-500 flex-shrink-0" />
              <span className="truncate">{course.ageRange}</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-cream-100 border border-[#EDE4D5] text-charcoal-700 font-semibold">
              <Clock className="w-3.5 h-3.5 text-lavender-600 flex-shrink-0" />
              <span className="truncate">30m 1-on-1 Trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing and Action Buttons */}
      <div className="p-6 pt-0 space-y-4">
        {/* Pricing Block */}
        <div className="pt-3.5 border-t border-[#EDE4D5]/80 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-charcoal-600 block">
              Course Tuition
            </span>
            <div className="text-lg font-display font-black text-charcoal-900">
              {course.pricing.currencySymbol}
              {course.pricing.amount}{' '}
              <span className="text-xs font-normal text-charcoal-600">/ class</span>
            </div>
            <span className="block text-[10px] text-charcoal-600">
              {course.pricing.billingPeriod}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
              1st Class FREE
            </span>
            <span className="block text-[9px] text-charcoal-600 mt-0.5">Sample catalog price</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onViewDetails(course)}
            className="w-full py-2.5 px-3 rounded-2xl border border-[#EDE4D5] bg-cream-50 hover:bg-cream-200 text-charcoal-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-charcoal-500" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(course)}
            className={`w-full py-2.5 px-3 rounded-2xl text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              isSelected
                ? 'bg-coral-600 text-white shadow-coral-glow'
                : 'bg-charcoal-900 hover:bg-coral-500 text-white'
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
