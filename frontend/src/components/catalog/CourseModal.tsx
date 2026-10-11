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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${course.colorGradient} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {course.badge}
          </div>

          <h2 id="course-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {course.name}
          </h2>
          <p className="text-white/90 text-sm mt-1 max-w-lg">
            {course.category} • {course.ageRange} ({course.grades})
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-200px)] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Target Audience
              </span>
              <span className="font-bold text-slate-800 block">{course.ageRange}</span>
              <span className="text-slate-500">{course.grades}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Class Duration
              </span>
              <span className="font-bold text-slate-800 block">30m Free Trial</span>
              <span className="text-slate-500">60m Regular Class</span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Curriculum Scope
              </span>
              <span className="font-bold text-slate-800 block">{course.totalSessions}</span>
              <span className="text-slate-500">1-on-1 Personalized</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              Course Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{course.fullDescription}</p>
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What Students Will Learn
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Topics */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Focus Modules</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.keyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Prerequisites & Readiness:</span>
              <span>{course.prerequisites}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                Regular Course Tuition
              </div>
              <div className="text-xl font-bold mt-0.5">
                {course.pricing.currencySymbol}
                {course.pricing.amount} <span className="text-xs font-normal text-slate-300">/ class</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{course.pricing.billingPeriod}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                1st Trial Class: FREE (100% Off)
              </span>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                * {course.pricing.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSelectAndBook(course)}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-600/20 hover:shadow-sky-600/30 transition-all flex items-center gap-2"
          >
            <span>Book a Free Trial in {course.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
