import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookableSlot } from '../../api/client.js';
import { formatInstantDisplay, formatTimeOnly } from '../../utils/timezone.js';
import {
  User,
  Mail,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const bookingFormSchema = z.object({
  parentName: z.string().min(2, 'Please enter your name (at least 2 characters)'),
  parentEmail: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().optional(),
  courseName: z.string().optional(),
  studentName: z.string().optional(),
  studentGrade: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export interface BookingIntentData {
  parentName: string;
  parentEmail: string;
  countryCode?: string;
  phoneNumber?: string;
  rawPhoneNumber?: string;
  courseId?: string;
  courseName?: string;
  courseCategory?: string;
  studentName?: string;
  studentGrade?: string;
  notes?: string;
}

interface BookingFormProps {
  selectedSlot: BookableSlot | null;
  parentTimezone: string;
  bookingIntent?: BookingIntentData | null;
  onSubmit: (data: BookingFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  onBackToSlots?: () => void;
  onEditParentInfo?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSlot,
  parentTimezone,
  bookingIntent,
  onSubmit,
  loading,
  error,
  onBackToSlots,
  onEditParentInfo,
}) => {
  const isFromLanding = Boolean(bookingIntent?.parentEmail && bookingIntent?.parentName);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      parentName: bookingIntent?.parentName || '',
      parentEmail: bookingIntent?.parentEmail || '',
      phoneNumber: bookingIntent?.phoneNumber || '',
      courseName: bookingIntent?.courseName || 'Mathematics',
      studentName: bookingIntent?.studentName || '',
      studentGrade: bookingIntent?.studentGrade || 'Grade 4-6 (Ages 9-11)',
      notes: bookingIntent?.notes || '',
    },
  });

  if (!selectedSlot) {
    return (
      <div className="bg-white rounded-3xl border border-[#EDE4D5] p-8 text-center space-y-4 shadow-warm-md">
        <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center mx-auto border border-coral-200">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-extrabold text-charcoal-900">Select an Appointment Slot</h3>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            Choose a date and click any available time slot on the left to review and finalize your trial booking.
          </p>
        </div>
      </div>
    );
  }

  const isPending = loading || isSubmitting;

  return (
    <div className="bg-white rounded-3xl border border-[#EDE4D5] p-6 sm:p-8 shadow-warm-md space-y-6">
      {/* Header */}
      <div className="border-b border-[#EDE4D5]/70 pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-50 text-coral-700 text-xs font-bold border border-coral-200">
          <Sparkles className="w-3 h-3 text-coral-600" />
          Step 2 of 2: Finalize Slot
        </div>
        <h3 className="text-xl font-black text-charcoal-900">Review & Confirm Booking</h3>
        <p className="text-xs text-charcoal-500">
          An eligible mentor from our roster will be automatically assigned for your live trial class.
        </p>
      </div>

      {/* Selected Slot Summary Badge */}
      <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-coral-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-coral-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-coral-600" />
            Selected Appointment Slot
          </span>
          {onBackToSlots && (
            <button
              type="button"
              onClick={onBackToSlots}
              disabled={isPending}
              className="text-coral-600 hover:text-coral-800 text-xs font-bold underline"
            >
              Change Slot
            </button>
          )}
        </div>
        <div className="text-sm sm:text-base font-black text-charcoal-900">
          {formatInstantDisplay(selectedSlot.startAt, parentTimezone)}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-600">
          <span>
            Your Time: <strong className="text-charcoal-800">{formatTimeOnly(selectedSlot.startAt, parentTimezone)} ({selectedSlot.parentUtcOffset})</strong>
          </span>
          <span>
            Mentor Time: <strong className="text-charcoal-800">{selectedSlot.mentorLocalTime} IST</strong>
          </span>
        </div>
      </div>

      {/* Step 1 Pre-filled Parent & Course Summary Card */}
      {isFromLanding && (
        <div className="p-4 rounded-2xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-charcoal-700 uppercase tracking-wider text-[11px]">
              Parent & Course Details (from Step 1)
            </span>
            {onEditParentInfo && (
              <button
                type="button"
                onClick={onEditParentInfo}
                disabled={isPending}
                className="text-coral-600 hover:text-coral-800 font-bold text-[11px] underline flex items-center gap-1"
              >
                <span>Edit Info</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-charcoal-700">
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Course</span>
              <span className="font-extrabold text-charcoal-900">{bookingIntent?.courseName || 'Mathematics'}</span>
            </div>
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Parent</span>
              <span className="font-extrabold text-charcoal-900">{bookingIntent?.parentName}</span>
            </div>
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Email</span>
              <span className="font-semibold text-charcoal-800">{bookingIntent?.parentEmail}</span>
            </div>
            {bookingIntent?.phoneNumber && (
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-semibold text-charcoal-800">{bookingIntent?.phoneNumber}</span>
              </div>
            )}
            {bookingIntent?.studentName && (
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Student</span>
                <span className="font-semibold text-charcoal-800">{bookingIntent?.studentName} ({bookingIntent?.studentGrade})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Booking Failed</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* If user navigated directly without landing page state, show editable inputs */}
        {!isFromLanding && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Parent Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  disabled={isPending}
                  placeholder="e.g. Sarah Jenkins"
                  {...register('parentName')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-cream-50/40 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.parentName
                      ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-[#EDE4D5] focus:ring-coral-400 focus:border-coral-500'
                  }`}
                />
              </div>
              {errors.parentName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.parentName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled={isPending}
                  placeholder="e.g. sarah.jenkins@example.com"
                  {...register('parentEmail')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-cream-50/40 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.parentEmail
                      ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-[#EDE4D5] focus:ring-coral-400 focus:border-coral-500'
                  }`}
                />
              </div>
              {errors.parentEmail && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.parentEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Student Grade / Age Group
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  disabled={isPending}
                  {...register('studentGrade')}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-50/40 border border-[#EDE4D5] rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-coral-500 transition-all text-charcoal-800"
                >
                  <option value="Grade 1-3 (Ages 6-8)">Grade 1-3 (Ages 6-8)</option>
                  <option value="Grade 4-6 (Ages 9-11)">Grade 4-6 (Ages 9-11)</option>
                  <option value="Grade 7-9 (Ages 12-14)">Grade 7-9 (Ages 12-14)</option>
                  <option value="Grade 10-12 (Ages 15-18)">Grade 10-12 (Ages 15-18)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-black text-sm sm:text-base shadow-warm-md hover:shadow-coral-glow focus:outline-none focus:ring-2 focus:ring-coral-400 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Booking with Mentor...</span>
              </>
            ) : (
              <span>Confirm & Book Free Trial Class</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live meeting link will be generated instantly upon confirmation</span>
        </div>
      </form>
    </div>
  );
};
