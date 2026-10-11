import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isHome = location.pathname === '/';

  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      navigate(`/${anchor}`);
    } else {
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookTrialClick = () => {
    setMobileMenuOpen(false);
    if (isHome) {
      const formEl = document.getElementById('book-trial-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EDE4D5]/80 bg-[#FAF8F5]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brandmark / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coral-500 via-coral-600 to-lavender-500 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-display font-black text-charcoal-900 tracking-tight leading-none">
                code<span className="text-coral-500">young</span>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-charcoal-600 tracking-wide block mt-0.5">
              1-on-1 STEM &amp; Coding for Kids
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all ${
              isHome
                ? 'text-coral-600 bg-coral-50 font-bold'
                : 'text-charcoal-700 hover:text-coral-600 hover:bg-cream-200/50'
            }`}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => handleNavClick('#courses')}
            className="text-sm font-semibold px-3.5 py-2 rounded-xl text-charcoal-700 hover:text-coral-600 hover:bg-cream-200/50 transition-all"
          >
            Courses
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="text-sm font-semibold px-3.5 py-2 rounded-xl text-charcoal-700 hover:text-coral-600 hover:bg-cream-200/50 transition-all"
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('#contact')}
            className="text-sm font-semibold px-3.5 py-2 rounded-xl text-charcoal-700 hover:text-coral-600 hover:bg-cream-200/50 transition-all"
          >
            Contact
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-cream-200/80 text-charcoal-700 border border-[#EDE4D5]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            10 Active Mentors
          </div>

          <button
            type="button"
            onClick={handleBookTrialClick}
            className="px-5 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm shadow-warm-sm hover:shadow-coral-glow transition-all duration-200 flex items-center gap-2 group"
          >
            <span>Book a Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-cream-200 text-charcoal-800 hover:bg-cream-300 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE4D5] bg-[#FAF8F5] px-5 py-5 space-y-3 shadow-warm-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-2xl text-base font-bold text-charcoal-800 hover:bg-coral-50 hover:text-coral-600"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => handleNavClick('#courses')}
            className="w-full text-left px-3.5 py-2.5 rounded-2xl text-base font-bold text-charcoal-800 hover:bg-coral-50 hover:text-coral-600"
          >
            Courses
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="w-full text-left px-3.5 py-2.5 rounded-2xl text-base font-bold text-charcoal-800 hover:bg-coral-50 hover:text-coral-600"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#contact')}
            className="w-full text-left px-3.5 py-2.5 rounded-2xl text-base font-bold text-charcoal-800 hover:bg-coral-50 hover:text-coral-600"
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBookTrialClick}
              className="w-full py-3.5 bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm rounded-full shadow-coral-glow flex items-center justify-center gap-2"
            >
              <span>Book a Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
