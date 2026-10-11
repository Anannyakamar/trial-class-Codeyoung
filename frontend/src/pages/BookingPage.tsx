import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { api, BookableSlot, ApiError, BookingData } from '../api/client.js';
import { getUserBrowserTimezone } from '../utils/timezone.js';
import { TimezoneSelector } from '../components/booking/TimezoneSelector.js';
import { DatePicker } from '../components/booking/DatePicker.js';
import { SlotGrid } from '../components/booking/SlotGrid.js';
import { BookingForm, BookingFormData, BookingIntentData } from '../components/booking/BookingForm.js';
import { BookingConfirmationView } from '../components/booking/BookingConfirmationView.js';
import { Sparkles, ShieldCheck, Video, Clock, ArrowLeft } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Retrieve passed booking intent from Step 1 (Landing Page)
  const bookingIntent: BookingIntentData | undefined = (
    location.state as { bookingIntent?: BookingIntentData } | null
  )?.bookingIntent;

  // Confirmed booking state (Dedicated confirmation screen on Page 2)
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [loadingConfirmed, setLoadingConfirmed] = useState<boolean>(false);

  // Timezone and Date State
  const [parentTimezone, setParentTimezone] = useState<string>(() => getUserBrowserTimezone());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [slots, setSlots] = useState<BookableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookableSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submittingBooking, setSubmittingBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [suggestedAlternatives, setSuggestedAlternatives] = useState<BookableSlot[]>([]);

  // Check if URL has confirmed booking id query param
  const confirmedIdFromUrl = searchParams.get('confirmed');
  useEffect(() => {
    if (confirmedIdFromUrl && !confirmedBooking) {
      setLoadingConfirmed(true);
      api
        .getBooking(confirmedIdFromUrl)
        .then((res) => {
          if (res.success && res.data) {
            setConfirmedBooking(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingConfirmed(false));
    }
  }, [confirmedIdFromUrl, confirmedBooking]);

  // Fetch Available Slots whenever date or timezone changes
  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot(null);
    setSuggestedAlternatives([]);

    try {
      const response = await api.getAvailability({
        date: selectedDate,
        timezone: parentTimezone,
        durationMinutes: 30,
      });

      if (response.success && response.data) {
        setSlots(response.data.slots);
      } else {
        setSlots([]);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setSlotsError(apiErr.message || 'Failed to fetch available slots');
      if (apiErr.details?.suggestedAlternatives) {
        setSuggestedAlternatives(apiErr.details.suggestedAlternatives);
      }
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, parentTimezone]);

  useEffect(() => {
    if (!confirmedBooking) {
      fetchSlots();
    }
  }, [fetchSlots, confirmedBooking]);

  // Handle Booking Submission
  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedSlot) return;

    setSubmittingBooking(true);
    setBookingError(null);

    try {
      const courseName = bookingIntent?.courseName || formData.courseName || 'Mathematics';
      const phoneNumber = bookingIntent?.phoneNumber || formData.phoneNumber || '';
      const studentName = bookingIntent?.studentName || formData.studentName || '';
      const userNotes = formData.notes || bookingIntent?.notes || '';

      const coursePart = courseName ? `Course: ${courseName}` : '';
      const phonePart = phoneNumber ? `Phone: ${phoneNumber}` : '';
      const studentPart = studentName ? `Student: ${studentName}` : '';

      const notesArr = [coursePart, phonePart, studentPart, userNotes].filter(Boolean);
      const combinedNotes = notesArr.join(' | ').slice(0, 500);

      const res = await api.createBooking({
        parentName: bookingIntent?.parentName || formData.parentName,
        parentEmail: (bookingIntent?.parentEmail || formData.parentEmail).toLowerCase().trim(),
        parentTimezone,
        startTime: selectedSlot.startAt,
        studentGrade: bookingIntent?.studentGrade || formData.studentGrade,
        notes: combinedNotes,
        studentName,
        phoneNumber,
        courseName,
      });

      if (res.success && res.data) {
        // Show dedicated confirmation screen on Page 2
        setConfirmedBooking({
          ...res.data,
          courseName,
          studentName,
          phoneNumber,
          studentGrade: bookingIntent?.studentGrade || formData.studentGrade,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setBookingError(apiErr.message || 'Booking failed. Please try an alternative slot.');
      if (apiErr.details?.suggestedAlternatives) {
        setSuggestedAlternatives(apiErr.details.suggestedAlternatives);
      }
    } finally {
      setSubmittingBooking(false);
    }
  };

  // If viewing confirmed booking details
  if (loadingConfirmed) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-charcoal-600">Retrieving booking receipt...</p>
      </div>
    );
  }

  if (confirmedBooking) {
    return (
      <BookingConfirmationView
        booking={confirmedBooking}
        courseName={bookingIntent?.courseName || confirmedBooking.courseName}
        phoneNumber={bookingIntent?.phoneNumber || confirmedBooking.phoneNumber}
        studentName={bookingIntent?.studentName || confirmedBooking.studentName}
        studentGrade={bookingIntent?.studentGrade || confirmedBooking.studentGrade}
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Workflow Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EDE4D5] pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-charcoal-600 hover:text-coral-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <Link
            to="/"
            className="px-3 py-1 rounded-full bg-cream-100 text-charcoal-600 hover:bg-cream-200 transition-colors"
          >
            1. Parent & Course
          </Link>
          <span className="text-charcoal-300">→</span>
          <span className="px-3 py-1 rounded-full bg-coral-50 text-coral-700 border border-coral-200">
            2. Date & Time Slot
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-700 text-xs font-bold border border-coral-200">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          1-on-1 Interactive Trial Session
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
          Select Your Preferred Appointment Slot
        </h1>
        <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
          {bookingIntent?.courseName ? (
            <>
              Scheduling trial class for <strong>{bookingIntent.courseName}</strong>. Choose a convenient time in your local timezone.
            </>
          ) : (
            'Select your preferred time. Our system will automatically assign an available mentor from our active roster.'
          )}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-xs text-charcoal-700">
        <div className="flex items-center gap-2 p-3.5 bg-white rounded-2xl border border-[#EDE4D5] shadow-warm-sm">
          <Clock className="w-4 h-4 text-coral-500 flex-shrink-0" />
          <span className="font-semibold">30 Minutes Demo Class</span>
        </div>
        <div className="flex items-center gap-2 p-3.5 bg-white rounded-2xl border border-[#EDE4D5] shadow-warm-sm">
          <Video className="w-4 h-4 text-lavender-600 flex-shrink-0" />
          <span className="font-semibold">Instant Meeting Link</span>
        </div>
        <div className="flex items-center gap-2 p-3.5 bg-white rounded-2xl border border-[#EDE4D5] shadow-warm-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">Automated Mentor Assignment</span>
        </div>
      </div>

      {/* Main Booking Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timezone, Date & Slot Selection (Step 1) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EDE4D5] p-6 sm:p-8 shadow-warm-md space-y-6">
          <div className="border-b border-[#EDE4D5]/70 pb-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Step 2 of 2
            </span>
            <h2 className="text-xl font-black text-charcoal-900">Choose Date & Time Slot</h2>
          </div>

          <TimezoneSelector
            value={parentTimezone}
            onChange={(tz) => setParentTimezone(tz)}
            disabled={loadingSlots || submittingBooking}
          />

          <DatePicker
            selectedDate={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            disabled={loadingSlots || submittingBooking}
          />

          <SlotGrid
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            loading={loadingSlots}
            error={slotsError}
            parentTimezone={parentTimezone}
            onSelectAlternativeDate={(date) => setSelectedDate(date)}
            suggestedAlternatives={suggestedAlternatives}
          />
        </div>

        {/* Right Column: Parent Details & Submit */}
        <div className="lg:col-span-5">
          <BookingForm
            selectedSlot={selectedSlot}
            parentTimezone={parentTimezone}
            bookingIntent={bookingIntent}
            onSubmit={handleBookingSubmit}
            loading={submittingBooking}
            error={bookingError}
            onBackToSlots={() => setSelectedSlot(null)}
            onEditParentInfo={() => window.location.assign('/')}
          />
        </div>
      </div>
    </div>
  );
};
