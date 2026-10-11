import React, { useEffect, useState } from 'react';
import { api, HealthResponse } from '../api/client.js';
import {
  Calendar,
  ShieldCheck,
  Globe2,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.checkHealth();
      setHealth(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to connect to backend service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendHealth();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wide border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 2 Infrastructure Ready
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Trial Class Booking System
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Schedule 1-on-1 coding trial classes with available mentors. Engineered with strict
            calendar-day capacity limits, automatic timezone conversions across US, UK, and India, and
            PostgreSQL-backed concurrency protection.
          </p>

          {/* Backend Health Check Status Card */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-sm">
              <span className="text-slate-300 font-medium">Backend API Status:</span>
              {loading ? (
                <span className="flex items-center gap-1.5 text-amber-300">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting to API...
                </span>
              ) : error ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <AlertCircle className="w-4 h-4" />
                    API Offline ({error})
                  </span>
                  <button
                    onClick={fetchBackendHealth}
                    className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  API Healthy ({health?.service} v{health?.version})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">10 Mentor Roster</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Automatic mentor allocation with strict enforcement of max 2 demo classes per mentor-local
            calendar day in <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">Asia/Kolkata</code>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Timezone Engine</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Native IANA timezone translation for US, UK, and India parents. Wall-clock DST disambiguation
            powered by <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">@js-temporal/polyfill</code>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Concurrency Safe</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            PostgreSQL row-level locking ensures zero double-booking or quota violations even when
            multiple parents request identical slots at the exact same millisecond.
          </p>
        </div>
      </div>

      {/* Booking Form Placeholder for Phase 6 */}
      <div className="bg-slate-100/80 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 mx-auto flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-semibold text-slate-800">Booking Engine Foundation Established</h3>
          <p className="text-xs text-slate-500">
            Database models, Prisma migrations, and Express health endpoints are initialized. Full booking
            flow (Slot Selection & Confirmation) will be implemented in Phases 3 through 6.
          </p>
        </div>
      </div>
    </div>
  );
};
