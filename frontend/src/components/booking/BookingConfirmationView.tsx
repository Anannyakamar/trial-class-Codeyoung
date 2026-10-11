import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingData } from '../../api/client.js';
import {
  CheckCircle2,
  Clock,
  User,
  Video,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Award,
} from 'lucide-react';

interface BookingConfirmationViewProps {
  booking: BookingData;
  courseName?: string;
  phoneNumber?: string;
  studentName?: string;
  studentGrade?: string;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  courseName,
  phoneNumber,
  studentName,
  studentGrade,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const displayCourse =
    courseName ||
    booking.courseName ||
    (booking.parent as { courseName?: string })?.courseName ||
    'Coding & STEM Trial Class';

  const displayPhone =
    phoneNumber ||
    booking.phoneNumber ||
    booking.parent.phoneNumber ||
    undefined;

  const displayStudent =
    studentName ||
    booking.studentName ||
    undefined;

  const displayGrade =
    studentGrade ||
    booking.studentGrade ||
    undefined;

  const handleCopyLink = () => {
    if (booking?.classLink) {
      navigator.clipboard.writeText(booking.classLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-warm-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Booking Confirmed & Mentor Assigned
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
          Your Free Trial Class is Scheduled!
        </h1>
        <p className="text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
          An expert mentor has been reserved for your 1-on-1 trial session. A confirmation record and live class link are generated below.
        </p>
      </div>

      {/* Main Confirmation Receipt Card */}
      <div className="bg-white rounded-3xl border border-[#EDE4D5] shadow-warm-lg overflow-hidden divide-y divide-[#EDE4D5]/70">
        {/* Header: Reference ID & Status */}
        <div className="p-6 bg-cream-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-charcoal-400 font-bold uppercase tracking-wider block">
              Booking Confirmation Reference ID
            </span>
            <div className="font-mono text-xs sm:text-sm font-extrabold text-charcoal-800 break-all select-all">
              {booking.id}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              STATUS: {booking.status}
            </span>
          </div>
        </div>

        {/* Course & Student Highlight */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-coral-50/40 via-cream-50/60 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-coral-500 text-white flex items-center justify-center shadow-warm-sm flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-coral-600 block">
                Selected Course
              </span>
              <h2 className="text-xl font-extrabold text-charcoal-900">{displayCourse}</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white border border-[#EDE4D5] text-charcoal-700 font-bold shadow-warm-sm">
              1-on-1 Interactive Demo
            </span>
            <span className="px-3 py-1 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 font-bold">
              30 Minutes • 100% Free
            </span>
          </div>
        </div>

        {/* Schedule & Timezone Section */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Time Details */}
          <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-coral-200/70 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-coral-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-coral-500" />
              <span>Parent Local Schedule ({booking.parentTimezone})</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-charcoal-900">
                {booking.parent.formattedDisplay}
              </div>
              <div className="text-xs text-charcoal-600">
                Time Interval: <strong className="text-charcoal-800">{booking.parent.localStartTime} – {booking.parent.localEndTime} ({booking.parent.utcOffset})</strong>
              </div>
            </div>
          </div>

          {/* Mentor Time Details */}
          <div className="p-5 rounded-2xl bg-cream-50/70 border border-[#EDE4D5] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
              <User className="w-4 h-4 text-charcoal-500" />
              <span>Mentor Local Schedule ({booking.mentorTimezone})</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-charcoal-900">
                {booking.mentor.formattedDisplay}
              </div>
              <div className="text-xs text-charcoal-600">
                Time Interval: <strong className="text-charcoal-800">{booking.mentor.localStartTime} – {booking.mentor.localEndTime} IST ({booking.mentor.utcOffset})</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Parent & Student Details Grid */}
        <div className="p-6 sm:p-8 bg-white space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
            Registered Parent & Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-1">
              <span className="text-charcoal-400 flex items-center gap-1 font-bold text-[10px] uppercase">
                <User className="w-3.5 h-3.5" /> Parent Name
              </span>
              <span className="font-extrabold text-charcoal-900 text-sm block">{booking.parent.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-1">
              <span className="text-charcoal-400 flex items-center gap-1 font-bold text-[10px] uppercase">
                <Mail className="w-3.5 h-3.5" /> Parent Email
              </span>
              <span className="font-extrabold text-charcoal-900 text-sm block truncate">{booking.parent.email}</span>
            </div>

            {displayPhone && (
              <div className="p-3.5 rounded-xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-1">
                <span className="text-charcoal-400 flex items-center gap-1 font-bold text-[10px] uppercase">
                  <Phone className="w-3.5 h-3.5" /> Contact Phone
                </span>
                <span className="font-extrabold text-charcoal-900 text-sm block">{displayPhone}</span>
              </div>
            )}

            {displayStudent && (
              <div className="p-3.5 rounded-xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-1">
                <span className="text-charcoal-400 flex items-center gap-1 font-bold text-[10px] uppercase">
                  <GraduationCap className="w-3.5 h-3.5" /> Student Name
                </span>
                <span className="font-extrabold text-charcoal-900 text-sm block">{displayStudent}</span>
              </div>
            )}

            {displayGrade && (
              <div className="p-3.5 rounded-xl bg-cream-50/60 border border-[#EDE4D5]/80 space-y-1">
                <span className="text-charcoal-400 flex items-center gap-1 font-bold text-[10px] uppercase">
                  <Award className="w-3.5 h-3.5" /> Grade Level
                </span>
                <span className="font-extrabold text-charcoal-900 text-sm block">{displayGrade}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Mentor Details Card */}
        <div className="p-6 sm:p-8 bg-cream-50/50 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
            Assigned Mentor Profile
          </span>
          <div className="p-4 rounded-2xl bg-white border border-[#EDE4D5] shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-coral-500 text-white flex items-center justify-center font-extrabold text-base shadow-warm-sm">
                {booking.mentor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-charcoal-900">{booking.mentor.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Active Mentor
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  {booking.mentor.bio ||
                    'Verified Codeyoung Educator specializing in live interactive STEM and coding instruction.'}
                </p>
              </div>
            </div>
            <div className="text-xs text-charcoal-600 font-medium">
              Timezone: <strong className="text-charcoal-900">{booking.mentorTimezone}</strong>
            </div>
          </div>
        </div>

        {/* Meeting Link & Join Section */}
        <div className="p-6 sm:p-8 bg-[#1C1A24] text-white space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-coral-300 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>Live Trial Class Room Link</span>
            </div>
            <h3 className="text-lg font-black text-white font-display">Join Your 1-on-1 Class</h3>
            <p className="text-xs text-warmgray-300">
              Use this link on the scheduled date to join the video session with your mentor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={booking.classLink}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-mono text-coral-200 shadow-inner focus:outline-none select-all"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-warmgray-300" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={booking.classLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-black shadow-coral-glow transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                <span>Join Trial Class</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-warmgray-400 italic">
            ℹ️ {booking.simulationNotice || 'Appointment is confirmed in the system. External classroom meeting link is generated for demonstration.'}
          </p>
        </div>
      </div>

      {/* Return to Course Catalog Button (NO Manage Booking) */}
      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#EDE4D5] hover:bg-cream-100 text-charcoal-700 text-sm font-bold shadow-warm-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Book Another Trial Class</span>
        </Link>
      </div>
    </div>
  );
};
