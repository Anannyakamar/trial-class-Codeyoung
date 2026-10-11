import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Search, Menu, X, BookOpen, HelpCircle, PhoneCall } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight block leading-none">
              Codeyoung
            </span>
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
              1-on-1 Trial Class
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
              isHome
                ? 'text-sky-700 bg-sky-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => handleNavClick('#courses')}
            className="text-xs font-bold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            Courses
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="text-xs font-bold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('#contact')}
            className="text-xs font-bold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            Contact
          </button>

          <Link
            to="/manage"
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              location.pathname.startsWith('/manage')
                ? 'text-sky-700 bg-sky-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Manage Booking
          </Link>
        </nav>

        {/* Action Button & Status */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            10 Active Mentors
          </div>

          <button
            type="button"
            onClick={handleBookTrialClick}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Trial</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => handleNavClick('#courses')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Courses
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#how-it-works')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#contact')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Contact
          </button>
          <Link
            to="/manage"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <Search className="w-4 h-4" />
            Manage Booking
          </Link>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBookTrialClick}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Trial</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
