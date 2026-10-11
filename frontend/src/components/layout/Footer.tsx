import React from 'react';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span>Global Timezone Support: US (ET/PT), UK (GMT/BST), India (IST)</span>
        </div>
        <div>
          © {new Date().getFullYear()} Codeyoung Trial Booking System. Phase 2 Setup.
        </div>
      </div>
    </footer>
  );
};
