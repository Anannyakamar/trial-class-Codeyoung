import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES, Course } from '../data/courses.js';
import { CourseCard } from '../components/catalog/CourseCard.js';
import { CourseModal } from '../components/catalog/CourseModal.js';
import { ParentBookingForm, ParentBookingFormData } from '../components/catalog/ParentBookingForm.js';
import {
  Sparkles,
  Award,
  Users,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Clock,
  HelpCircle,
  Mail,
  ChevronRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected course state
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle course selection from card or modal
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    // Smooth scroll to form if on mobile or lower down
    const formElement = document.getElementById('book-trial-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewDetails = (course: Course) => {
    setModalCourse(course);
    setIsModalOpen(true);
  };

  const handleModalSelectAndBook = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(false);
    const formElement = document.getElementById('book-trial-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Parent Booking Form Submission -> Navigate to /book-trial
  const handleParentFormSubmit = async (formData: ParentBookingFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const course = COURSES.find((c) => c.id === formData.courseId) || selectedCourse;

      // Bundle validated parent & course payload
      const bookingIntent = {
        parentName: formData.parentName.trim(),
        parentEmail: formData.parentEmail.toLowerCase().trim(),
        countryCode: formData.countryCode,
        phoneNumber: `${formData.countryCode} ${formData.phoneNumber.trim()}`,
        rawPhoneNumber: formData.phoneNumber.trim(),
        courseId: course.id,
        courseName: course.name,
        courseCategory: course.category,
        studentName: formData.studentName?.trim() || '',
        studentGrade: formData.studentGrade || 'Grade 4-6 (Ages 9-11)',
        notes: formData.notes?.trim() || '',
      };

      // Navigate to /book-trial carrying state
      navigate('/book-trial', {
        state: { bookingIntent },
      });
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to process booking details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Empowering Young Innovators (Ages 6–18)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            1-on-1 Online Coding & STEM Classes for Kids
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Give your child the gift of future-ready skills. Learn Mathematics, Coding, Science, Cyber Security,
            and Web Development with dedicated expert mentors in live, interactive sessions.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#book-trial-form"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all flex items-center gap-2"
            >
              <span>Book a Free Trial Class</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#courses"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
            >
              Explore Course Catalog
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Free Live Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Personal 1:1 Mentorship</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>US, UK & India Timezones</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section: Course Catalog + Parent Booking Form */}
      <section id="courses" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Interactive Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Our Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Select a course below to preview outcomes, syllabus highlights, and instantly sync with your trial booking form.
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>STEM Accredited Pedagogy</span>
          </div>
        </div>

        {/* Two-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Catalog (6 Courses) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isSelected={selectedCourse.id === course.id}
                  onSelect={handleSelectCourse}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Catalog Pricing Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700">Centralized Catalog Pricing Notice:</strong>
                <p className="mt-0.5 text-slate-500">
                  Course prices listed above are sample/placeholder values for demonstration and workflow purposes.
                  First trial class is 100% free with no payment required.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Parent Booking Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ParentBookingForm
              selectedCourse={selectedCourse}
              onSelectCourse={setSelectedCourse}
              onSubmit={handleParentFormSubmit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-8 scroll-mt-24 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Your Free Trial Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Booking a class is seamless. We pair your child with an expert mentor matching your preferred schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-black text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Choose Course & Details</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select your child&apos;s course interest and fill in parent contact info to tailor the learning level.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Select Date & Live Slot</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pick a convenient time in your local timezone. Available mentor capacity is locked in real-time.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Join Live 1-on-1 Class</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive your instant video class link, meet your assigned mentor, and start building cool projects.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Value Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Top 1% STEM Mentors</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Passionate educators vetted for child pedagogy, technical expertise, and engaging teaching methodologies.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Seamless Global Timezones</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Instant automatic conversion for US Eastern/Pacific, UK GMT/BST, and India IST timezones.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Structured Curriculum</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Project-based learning with tangible milestones, interactive coding sandboxes, and personalized feedback.
          </p>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section id="contact" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8 scroll-mt-24">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Parent Support & FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Have Questions Before Booking?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We are here to help parents choose the right course and get the most out of their child&apos;s trial session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Is the trial class really 100% free?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, completely free. No payment details or credit cards are required to book your 30-minute 1-on-1 trial class.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">What equipment does my child need?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A laptop or desktop computer with a working webcam, microphone, and standard Google Chrome or Edge browser.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Can I reschedule or cancel my booking?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! You can manage or cancel your appointment at any time through our Manage Booking page using your booking reference.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Need Direct Assistance?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach our parent academic advisory team directly at{' '}
                <a href="mailto:support@codeyoung.com" className="font-semibold text-sky-600 hover:underline">
                  support@codeyoung.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      <CourseModal
        course={modalCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAndBook={handleModalSelectAndBook}
      />
    </div>
  );
};
