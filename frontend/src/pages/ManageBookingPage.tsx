import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, BookingData, ApiError } from '../api/client.js';
import {
  Search,
  Clock,
  User,
  Video,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ManageBookingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [bookingId, setBookingId] = useState<string>(initialId);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cancellation State
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const fetchBooking = async (id: string) => {
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setCancelSuccess(null);

    try {
      const res = await api.getBooking(id.trim());
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        setError('Booking not found');
        setBooking(null);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Unable to retrieve booking');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchBooking(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId.trim()) {
      setSearchParams({ id: bookingId.trim() });
      fetchBooking(bookingId.trim());
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      const res = await api.cancelBooking(booking.id);
      if (res.success) {
        setCancelSuccess(res.data.message || 'Booking cancelled successfully');
        setShowCancelModal(false);
        // Refresh booking details
        await fetchBooking(booking.id);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      alert(`Cancellation failed: ${apiErr.message}`);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Your Booking</h1>
        <p className="text-sm text-slate-600">
          Enter your booking reference to check appointment status or make cancellations.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Paste your booking reference UUID..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !bookingId.trim()}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-2xl shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Find Booking'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cancelSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{cancelSuccess}</span>
        </div>
      )}

      {/* Booking Details Card */}
      {booking && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header with Status */}
          <div className="p-6 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Booking Reference
              </span>
              <div className="font-mono text-sm font-bold text-slate-800">{booking.id}</div>
            </div>
            <div>
              {booking.status === 'CONFIRMED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Confirmed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Cancelled
                </span>
              )}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Parent Local Time ({booking.parentTimezone})
              </span>
              <div className="text-sm font-bold text-slate-900">
                {booking.parent.formattedDisplay}
              </div>
              <div className="text-xs text-slate-500">
                {booking.parent.localStartTime} - {booking.parent.localEndTime} ({booking.parent.utcOffset})
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Mentor: {booking.mentor.name}
              </span>
              <div className="text-sm font-bold text-slate-800">
                {booking.mentor.formattedDisplay}
              </div>
              <div className="text-xs text-slate-500">
                {booking.mentor.localStartTime} - {booking.mentor.localEndTime} IST ({booking.mentor.utcOffset})
              </div>
            </div>
          </div>

          {/* Meeting Link (if confirmed) */}
          {booking.status === 'CONFIRMED' && (
            <div className="p-6 sm:p-8 space-y-3 bg-gradient-to-r from-sky-50/30 to-indigo-50/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-600" />
                Live Class Link
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={booking.classLink}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-700 shadow-sm"
                />
                <a
                  href={booking.classLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          )}

          {/* Actions & Cancellation Button */}
          <div className="p-6 bg-slate-50/70 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Booking
            </Link>

            {booking.status === 'CONFIRMED' && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
              >
                Cancel This Appointment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && booking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Cancel Trial Class?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel this appointment with mentor{' '}
                <strong>{booking.mentor.name}</strong> on{' '}
                <strong>{booking.parent.formattedDisplay}</strong>? This action will immediately release the mentor&apos;s capacity for other parents.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors flex items-center gap-1.5"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
