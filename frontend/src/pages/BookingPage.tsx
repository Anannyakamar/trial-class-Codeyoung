import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api, BookableSlot, ApiError } from '../api/client.js';
import { getUserBrowserTimezone } from '../utils/timezone.js';
import { TimezoneSelector } from '../components/booking/TimezoneSelector.js';
import { DatePicker } from '../components/booking/DatePicker.js';
import { SlotGrid } from '../components/booking/SlotGrid.js';
import { BookingForm, BookingFormData, BookingIntentData } from '../components/booking/BookingForm.js';
import { Sparkles, ShieldCheck, Video, Clock, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve passed booking intent from Step 1 (Landing Page)
  const bookingIntent: BookingIntentData | undefined = (
    location.state as { bookingIntent?: BookingIntentData } | null
  )?.bookingIntent;

  // State
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
    fetchSlots();
  }, [fetchSlots]);

  // Handle Booking Submission
  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedSlot) return;

    setSubmittingBooking(true);
    setBookingError(null);

    try {
      // Assemble notes bundling course name, student name, and phone
      const coursePart = bookingIntent?.courseName
        ? `Course: ${bookingIntent.courseName}`
        : formData.courseName
        ? `Course: ${formData.courseName}`
        : '';
      const phonePart = bookingIntent?.phoneNumber
        ? `Phone: ${bookingIntent.phoneNumber}`
        : formData.phoneNumber
        ? `Phone: ${formData.phoneNumber}`
        : '';
      const studentPart = bookingIntent?.studentName
        ? `Student: ${bookingIntent.studentName}`
        : formData.studentName
        ? `Student: ${formData.studentName}`
        : '';
      const userNotes = formData.notes || bookingIntent?.notes || '';

      const notesArr = [coursePart, phonePart, studentPart, userNotes].filter(Boolean);
      const combinedNotes = notesArr.join(' | ').slice(0, 500);

      const res = await api.createBooking({
        parentName: bookingIntent?.parentName || formData.parentName,
        parentEmail: (bookingIntent?.parentEmail || formData.parentEmail).toLowerCase().trim(),
        parentTimezone,
        startTime: selectedSlot.startAt,
        studentGrade: bookingIntent?.studentGrade || formData.studentGrade,
        notes: combinedNotes,
      });

      if (res.success && res.data) {
        // Navigate to confirmation receipt
        navigate(`/confirmation/${res.data.id}`, { state: { booking: res.data } });
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

  return (
    <div className="space-y-10">
      {/* Workflow Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <Link
            to="/"
            className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            1. Parent & Course
          </Link>
          <span className="text-slate-300">→</span>
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            2. Date & Time Slot
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          1-on-1 Interactive Trial Session
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Preferred Appointment Slot
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-xs text-slate-600">
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>30 Minutes Demo Class</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Video className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>Instant Meeting Link</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Automated Mentor Assignment</span>
        </div>
      </div>

      {/* Main Booking Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timezone, Date & Slot Selection (Step 1) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Step 2 of 2
            </span>
            <h2 className="text-xl font-bold text-slate-900">Choose Date & Time Slot</h2>
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
            onEditParentInfo={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};
