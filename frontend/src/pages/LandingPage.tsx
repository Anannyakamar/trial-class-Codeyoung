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
  HelpCircle,
  Mail,
  Compass,
  Rocket,
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
    <div className="space-y-16 sm:space-y-24">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#FFF5F2] via-[#FAF8F5] to-[#F1ECFA] border border-[#EDE4D5] p-8 sm:p-14 lg:p-16 shadow-warm-md">
        {/* Subtle Decorative Background Blobs */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-peach-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-lavender-100/60 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy, Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EDE4D5] text-coral-600 text-xs font-bold shadow-warm-sm">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>For Curious Kids Ages 6–18</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.1] text-charcoal-900">
              Big Ideas Start with Curious Minds.
            </h1>

            <p className="text-charcoal-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal">
              Personalized online learning that helps your child build confidence, explore new skills, and create something amazing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#courses"
                className="px-7 py-4 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-display font-bold text-sm sm:text-base shadow-warm-sm transition-all duration-200 flex items-center gap-2"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#book-trial-form"
                className="px-7 py-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm sm:text-base shadow-coral-glow transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Book a Free Trial</span>
                <Rocket className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Reassurance Highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#EDE4D5]/80 text-xs font-semibold text-charcoal-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Free Live Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1:1 Dedicated Mentorship</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>US, UK &amp; India Times</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-none">
              <img
                src="/courses/hero-illustration.svg"
                alt="Student learning coding and STEM with an interactive laptop"
                className="w-full h-auto drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Section: Course Catalog + Parent Booking Form */}
      <section id="courses" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EDE4D5] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-700 text-xs font-bold border border-coral-200">
              <Compass className="w-3.5 h-3.5 text-coral-500" />
              <span>Interactive 1-on-1 Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-charcoal-900 tracking-tight">
              Explore Our Courses
            </h2>
            <p className="text-sm text-charcoal-600 max-w-xl">
              Choose a subject below to view curriculum outcomes, target ages, and synchronize your free trial class booking.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-cream-100 border border-[#EDE4D5] text-xs text-charcoal-800 font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-coral-500 flex-shrink-0" />
            <span>STEM Accredited Pedagogy</span>
          </div>
        </div>

        {/* Two-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Cards Grid (6 Courses) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {/* Centralized Catalog Pricing Disclaimer */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-[#EDE4D5] text-xs text-charcoal-600 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-800">Centralized Catalog Pricing Notice:</strong>
                <p className="mt-0.5 text-charcoal-500">
                  Course prices listed above are sample/placeholder values for demonstration and workflow purposes.
                  First trial class is 100% free with no credit card required.
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
      <section id="how-it-works" className="space-y-8 scroll-mt-24 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 text-xs font-bold border border-lavender-200">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-charcoal-900 tracking-tight">
            How Your Free Trial Works
          </h2>
          <p className="text-sm text-charcoal-600">
            Booking is easy and hassle-free. We match your child with an expert educator based on your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE4D5] shadow-warm-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral-600 font-display font-black text-lg flex items-center justify-center border border-coral-200">
              1
            </div>
            <h3 className="text-lg font-display font-extrabold text-charcoal-900">Pick Course &amp; Share Goals</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Select your child&apos;s interest and share their grade to customize the trial class curriculum.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE4D5] shadow-warm-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-700 font-display font-black text-lg flex items-center justify-center border border-lavender-200">
              2
            </div>
            <h3 className="text-lg font-display font-extrabold text-charcoal-900">Select Date &amp; Live Time Slot</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Choose a slot in your local timezone. Available mentor capacity is reserved with live confirmation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE4D5] shadow-warm-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cream-200 text-charcoal-800 font-display font-black text-lg flex items-center justify-center border border-[#EDE4D5]">
              3
            </div>
            <h3 className="text-lg font-display font-extrabold text-charcoal-900">Join 1-on-1 Live Class</h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Receive your instant video classroom link, meet your assigned mentor, and start building real projects!
            </p>
          </div>
        </div>
      </section>

      {/* Educational Value Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EDE4D5] shadow-warm-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center border border-coral-200">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-charcoal-900">Top 1% STEM Mentors</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Passionate educators vetted for child pedagogy, technical expertise, and engaging teaching methodologies.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EDE4D5] shadow-warm-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center border border-lavender-200">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-charcoal-900">Seamless Global Timezones</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Instant automatic conversion for US Eastern/Pacific, UK GMT/BST, and India IST wall-clock schedules.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EDE4D5] shadow-warm-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cream-200 text-charcoal-800 flex items-center justify-center border border-[#EDE4D5]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-charcoal-900">Structured Pedagogy</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Hands-on projects with tangible milestones, interactive coding sandboxes, and personalized feedback.
          </p>
        </div>
      </section>

      {/* Parent Support & FAQ Section */}
      <section id="contact" className="bg-white rounded-4xl border border-[#EDE4D5] p-8 sm:p-12 shadow-warm-sm space-y-8 scroll-mt-24">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-charcoal-700 text-xs font-bold border border-[#EDE4D5]">
            <span>Parent Support &amp; FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-charcoal-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            We are here to help parents choose the right course and get the most out of their child&apos;s trial session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-cream-50 border border-[#EDE4D5] space-y-2">
              <h4 className="text-sm font-bold text-charcoal-900">Is the trial class really 100% free?</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Yes, completely free. No payment details or credit cards are required to book your 30-minute 1-on-1 trial class.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50 border border-[#EDE4D5] space-y-2">
              <h4 className="text-sm font-bold text-charcoal-900">What equipment does my child need?</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                A laptop or desktop computer with a working webcam, microphone, and standard Google Chrome or Edge browser.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-cream-50 border border-[#EDE4D5] space-y-2">
              <h4 className="text-sm font-bold text-charcoal-900">Can I reschedule or adjust my booking?</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Yes! If you need to change your appointment date or time, our parent support team is ready to assist at support@codeyoung.com.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-coral-50/70 border border-coral-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-coral-800">
                <Mail className="w-4 h-4 text-coral-500" />
                <span>Need Direct Academic Advice?</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Reach our parent academic advisory team directly at{' '}
                <a href="mailto:support@codeyoung.com" className="font-bold text-coral-600 hover:underline">
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
