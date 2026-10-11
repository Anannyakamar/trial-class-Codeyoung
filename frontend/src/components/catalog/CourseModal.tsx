import React, { useEffect } from 'react';
import { Course } from '../../data/courses.js';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Tag,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndBook: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onSelectAndBook,
}) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-warm-lg border border-[#EDE4D5] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cover Image Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full bg-[#FAF8F5] overflow-hidden border-b border-[#EDE4D5]">
          <img
            src={course.coverImage}
            alt={`${course.name} Illustration`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>{course.badge}</span>
            </div>
            <h2 id="course-modal-title" className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              {course.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-220px)] overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-cream-100 rounded-2xl border border-[#EDE4D5] text-xs">
            <div className="space-y-1">
              <span className="text-charcoal-500 font-semibold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-coral-500" />
                Target Audience
              </span>
              <span className="font-bold text-charcoal-900 block">{course.ageRange}</span>
              <span className="text-charcoal-500">{course.grades}</span>
            </div>
            <div className="space-y-1">
              <span className="text-charcoal-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lavender-600" />
                Class Duration
              </span>
              <span className="font-bold text-charcoal-900 block">30m Free Trial</span>
              <span className="text-charcoal-500">60m Regular Class</span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-charcoal-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-coral-500" />
                Curriculum Scope
              </span>
              <span className="font-bold text-charcoal-900 block">{course.totalSessions}</span>
              <span className="text-charcoal-500">1-on-1 Dedicated</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-coral-500" />
              Course Overview
            </h3>
            <p className="text-sm text-charcoal-700 leading-relaxed">{course.fullDescription}</p>
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What Students Will Learn &amp; Build
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-charcoal-800 bg-cream-50 p-3 rounded-2xl border border-[#EDE4D5]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Topics */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Key Modules Covered</h3>
            <div className="flex flex-wrap gap-2">
              {course.keyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-lavender-50 text-lavender-700 border border-lavender-200 rounded-xl text-xs font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-4 bg-peach-50 border border-peach-200 rounded-2xl flex items-start gap-2.5 text-xs text-charcoal-800">
            <HelpCircle className="w-4 h-4 text-coral-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Prerequisites &amp; Readiness:</span>
              <span className="text-charcoal-600">{course.prerequisites}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-3xl bg-charcoal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-coral-400 font-bold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                Regular Tuition
              </div>
              <div className="text-2xl font-display font-black mt-0.5">
                {course.pricing.currencySymbol}
                {course.pricing.amount} <span className="text-xs font-normal text-warmgray-400">/ class</span>
              </div>
              <p className="text-[11px] text-warmgray-400 mt-0.5">{course.pricing.billingPeriod}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 text-xs font-bold border border-coral-500/30">
                1st Trial Class: 100% FREE
              </span>
              <p className="text-[10px] text-warmgray-400 mt-1 italic">
                * {course.pricing.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-cream-50 border-t border-[#EDE4D5] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSelectAndBook(course)}
            className="px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white text-xs sm:text-sm font-display font-bold rounded-full shadow-coral-glow transition-all flex items-center gap-2"
          >
            <span>Book a Free Trial in {course.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
