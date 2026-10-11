import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api, BookingData } from '../api/client.js';
import {
  CheckCircle2,
  Clock,
  User,
  Video,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateBooking = (location.state as { booking?: BookingData })?.booking;

  const [booking, setBooking] = useState<BookingData | null>(stateBooking || null);
  const [loading, setLoading] = useState<boolean>(!stateBooking);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!booking && id) {
      setLoading(true);
      api
        .getBooking(id)
        .then((res) => {
          if (res.success && res.data) {
            setBooking(res.data);
          } else {
            setError('Unable to load booking details');
          }
        })
        .catch((err: Error) => {
          setError(err.message || 'Booking not found');
        })
        .finally(() => setLoading(false));
    }
  }, [id, booking]);

  const handleCopyLink = () => {
    if (booking?.classLink) {
      navigator.clipboard.writeText(booking.classLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Retrieving booking receipt...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Booking Receipt Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to locate this appointment.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking Page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Booking Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Your Free Trial Class is Scheduled!
        </h1>
        <p className="text-sm text-slate-600">
          A confirmation record has been created and your mentor has been assigned.
        </p>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Reference & Assigned Mentor Header */}
        <div className="p-6 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Booking Reference
            </span>
            <div className="font-mono text-sm font-bold text-slate-800">{booking.id}</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Assigned Mentor: {booking.mentor.name}</span>
          </div>
        </div>

        {/* Timezone Schedule Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Time Details */}
          <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Your Local Time ({booking.parentTimezone})
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-slate-900">
                {booking.parent.formattedDisplay}
              </div>
              <div className="text-xs text-slate-500">
                Duration: 30 minutes ({booking.parent.localStartTime} - {booking.parent.localEndTime} {booking.parent.utcOffset})
              </div>
            </div>
          </div>

          {/* Mentor Time Details */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              Mentor Local Time ({booking.mentorTimezone})
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-slate-800">
                {booking.mentor.formattedDisplay}
              </div>
              <div className="text-xs text-slate-500">
                {booking.mentor.localStartTime} - {booking.mentor.localEndTime} IST ({booking.mentor.utcOffset})
              </div>
            </div>
          </div>
        </div>

        {/* Live Meeting Link Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              Live Class Meeting Link
            </h3>
            <p className="text-xs text-slate-500">
              Click to join directly on the scheduled date or copy the link to your calendar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              readOnly
              value={booking.classLink}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-700 shadow-sm focus:outline-none select-all"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={booking.classLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Join</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {booking.simulationNotice && (
            <p className="text-[11px] text-slate-400 italic">
              ℹ️ {booking.simulationNotice}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm text-center transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Book Another Trial Class
        </Link>
        <Link
          to={`/manage?id=${booking.id}`}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md text-center transition-colors"
        >
          Manage or Cancel Booking
        </Link>
      </div>
    </div>
  );
};
