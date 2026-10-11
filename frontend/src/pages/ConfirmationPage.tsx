import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api, BookingData } from '../api/client.js';
import { BookingConfirmationView } from '../components/booking/BookingConfirmationView.js';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateBooking = (location.state as { booking?: BookingData })?.booking;

  const [booking, setBooking] = useState<BookingData | null>(stateBooking || null);
  const [loading, setLoading] = useState<boolean>(!stateBooking);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-charcoal-600">Retrieving booking receipt...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-white rounded-3xl border border-[#EDE4D5] text-center space-y-4 shadow-warm-md">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-charcoal-900 font-display">Booking Receipt Not Found</h2>
        <p className="text-sm text-charcoal-500">{error || 'Unable to locate this appointment.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 text-white text-sm font-bold hover:bg-coral-600 transition-all shadow-coral-glow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  return (
    <BookingConfirmationView
      booking={booking}
      courseName={booking.courseName}
      phoneNumber={booking.phoneNumber || booking.parent.phoneNumber}
      studentName={booking.studentName}
      studentGrade={booking.studentGrade}
    />
  );
};
