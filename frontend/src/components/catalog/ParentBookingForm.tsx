import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { COURSES, COUNTRY_CODES, Course } from '../../data/courses.js';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const parentBookingFormSchema = z.object({
  parentName: z
    .string()
    .min(2, 'Parent name must be at least 2 characters')
    .max(100, 'Parent name must not exceed 100 characters'),
  parentEmail: z
    .string()
    .email('Please enter a valid email address (e.g. name@domain.com)'),
  countryCode: z.string().min(1, 'Please select a country code'),
  phoneNumber: z
    .string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^[0-9\s\-()+]{7,15}$/, 'Please enter a valid phone number (digits and spaces only)'),
  courseId: z.string().min(1, 'Please select a course for the trial class'),
  studentName: z.string().max(100, 'Student name must not exceed 100 characters').optional(),
  studentGrade: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type ParentBookingFormData = z.infer<typeof parentBookingFormSchema>;

interface ParentBookingFormProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
  onSubmit: (data: ParentBookingFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  initialValues?: Partial<ParentBookingFormData>;
}

export const ParentBookingForm: React.FC<ParentBookingFormProps> = ({
  selectedCourse,
  onSelectCourse,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParentBookingFormData>({
    resolver: zodResolver(parentBookingFormSchema),
    defaultValues: {
      parentName: initialValues?.parentName || '',
      parentEmail: initialValues?.parentEmail || '',
      countryCode: initialValues?.countryCode || '+1',
      phoneNumber: initialValues?.phoneNumber || '',
      courseId: selectedCourse?.id || initialValues?.courseId || 'mathematics',
      studentName: initialValues?.studentName || '',
      studentGrade: initialValues?.studentGrade || 'Grade 4-6 (Ages 9-11)',
      notes: initialValues?.notes || '',
    },
  });

  const currentCourseId = watch('courseId');

  // Synchronize when parent selects a course from the catalog cards
  React.useEffect(() => {
    if (selectedCourse && selectedCourse.id !== currentCourseId) {
      setValue('courseId', selectedCourse.id, { shouldValidate: true });
    }
  }, [selectedCourse, setValue, currentCourseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setValue('courseId', newId, { shouldValidate: true });
    const matched = COURSES.find((c) => c.id === newId);
    if (matched) {
      onSelectCourse(matched);
    }
  };

  return (
    <div
      id="book-trial-form"
      className="bg-white rounded-4xl border border-[#EDE4D5] p-6 sm:p-8 shadow-warm-lg space-y-6 relative overflow-hidden"
    >
      {/* Decorative Warm Coral / Lavender Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-coral-500 via-coral-400 to-lavender-500" />

      {/* Header */}
      <div className="space-y-2 border-b border-[#EDE4D5] pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          <span>Step 1 of 2: Parent &amp; Course Details</span>
        </div>
        <h2 className="text-2xl font-display font-black text-charcoal-900 tracking-tight">
          Book Your Free Trial Class
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          Experience a personalized 1-on-1 demo with an expert educator. In Step 2, you&apos;ll pick your live appointment time.
        </p>
      </div>

      {/* Global Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 text-coral-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-coral-600" />
          <div>
            <strong className="block font-bold">Please check the form:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Currently Selected Course Visual Indicator */}
      {selectedCourse && (
        <div className="p-4 rounded-2xl bg-cream-100 border border-[#EDE4D5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-charcoal-500 font-medium block text-[11px] uppercase tracking-wider">
                Selected Course
              </span>
              <span className="font-display font-bold text-charcoal-900 text-sm">{selectedCourse.name}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white border border-[#EDE4D5] text-charcoal-700 font-bold text-[11px] shadow-warm-sm">
            {selectedCourse.ageRange}
          </span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Parent Full Name */}
        <div>
          <label htmlFor="parentName" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Parent / Guardian Full Name <span className="text-coral-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="parentName"
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. Sarah Jenkins"
              {...register('parentName')}
              className={`w-full pl-10 pr-4 py-3 bg-cream-50 border rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.parentName
                  ? 'border-coral-300 focus:ring-coral-500 focus:border-coral-500 bg-coral-50/30'
                  : 'border-[#EDE4D5] focus:ring-coral-500 focus:border-coral-500'
              }`}
            />
          </div>
          {errors.parentName && (
            <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.parentName.message}
            </p>
          )}
        </div>

        {/* Parent Email */}
        <div>
          <label htmlFor="parentEmail" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Email Address <span className="text-coral-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="parentEmail"
              type="email"
              disabled={isSubmitting}
              placeholder="e.g. sarah.jenkins@example.com"
              {...register('parentEmail')}
              className={`w-full pl-10 pr-4 py-3 bg-cream-50 border rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.parentEmail
                  ? 'border-coral-300 focus:ring-coral-500 focus:border-coral-500 bg-coral-50/30'
                  : 'border-[#EDE4D5] focus:ring-coral-500 focus:border-coral-500'
              }`}
            />
          </div>
          {errors.parentEmail && (
            <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.parentEmail.message}
            </p>
          )}
        </div>

        {/* Phone Number with Country Code */}
        <div>
          <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Phone Number <span className="text-coral-500">*</span>
          </label>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 sm:col-span-4">
              <select
                id="countryCode"
                disabled={isSubmitting}
                {...register('countryCode')}
                className="w-full px-2.5 py-3 bg-cream-50 border border-[#EDE4D5] rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-all"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-7 sm:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                disabled={isSubmitting}
                placeholder="555-0199"
                {...register('phoneNumber')}
                className={`w-full pl-10 pr-3 py-3 bg-cream-50 border rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.phoneNumber
                    ? 'border-coral-300 focus:ring-coral-500 focus:border-coral-500 bg-coral-50/30'
                    : 'border-[#EDE4D5] focus:ring-coral-500 focus:border-coral-500'
                }`}
              />
            </div>
          </div>
          {errors.phoneNumber && (
            <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Course Selection */}
        <div>
          <label htmlFor="courseId" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Selected Course <span className="text-coral-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <select
              id="courseId"
              disabled={isSubmitting}
              value={watch('courseId')}
              onChange={handleCourseChange}
              className={`w-full pl-10 pr-4 py-3 bg-cream-50 border rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.courseId
                  ? 'border-coral-300 focus:ring-coral-500 focus:border-coral-500'
                  : 'border-[#EDE4D5] focus:ring-coral-500 focus:border-coral-500'
              }`}
            >
              {COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.category} — {course.ageRange})
                </option>
              ))}
            </select>
          </div>
          {errors.courseId && (
            <p className="mt-1.5 text-xs text-coral-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.courseId.message}
            </p>
          )}
        </div>

        {/* Student Name & Grade Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Child&apos;s Name <span className="text-charcoal-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="studentName"
                type="text"
                disabled={isSubmitting}
                placeholder="e.g. Leo"
                {...register('studentName')}
                className="w-full pl-10 pr-3 py-3 bg-cream-50 border border-[#EDE4D5] rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="studentGrade" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Grade Group
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                id="studentGrade"
                disabled={isSubmitting}
                {...register('studentGrade')}
                className="w-full pl-10 pr-3 py-3 bg-cream-50 border border-[#EDE4D5] rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-all"
              >
                <option value="Grade 1-3 (Ages 6-8)">Grade 1-3 (Ages 6-8)</option>
                <option value="Grade 4-6 (Ages 9-11)">Grade 4-6 (Ages 9-11)</option>
                <option value="Grade 7-9 (Ages 12-14)">Grade 7-9 (Ages 12-14)</option>
                <option value="Grade 10-12 (Ages 15-18)">Grade 10-12 (Ages 15-18)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Learning Goals / Notes <span className="text-charcoal-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 pointer-events-none text-charcoal-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              id="notes"
              rows={2}
              disabled={isSubmitting}
              placeholder="e.g. Any prior coding, math, or robotics background..."
              {...register('notes')}
              className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-[#EDE4D5] rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-all"
            />
          </div>
        </div>

        {/* Submit Action: Standout Coral CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-display font-extrabold text-sm sm:text-base shadow-coral-glow hover:shadow-warm-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Parent Information...</span>
              </>
            ) : (
              <>
                <span>Book My Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust reassurance */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-charcoal-600 border-t border-[#EDE4D5]">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>100% Free Trial Class • No credit card required</span>
      </div>
    </div>
  );
};
