import React from 'react';
import { Globe2, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#EDE4D5] bg-[#F4EFE6]/60 py-12 mt-auto text-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral-500 to-lavender-500 flex items-center justify-center text-white shadow-warm-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-display font-black text-charcoal-900 leading-none block">
                code<span className="text-coral-500">young</span>
              </span>
              <span className="text-[11px] font-medium text-charcoal-600">
                Inspiring the next generation of creative builders
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white border border-[#EDE4D5] text-charcoal-700 shadow-warm-sm">
            <Globe2 className="w-4 h-4 text-coral-500" />
            <span>International Wall-Clock Scheduling: US (ET/PT), UK (GMT/BST), India (IST)</span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EDE4D5]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <div>
            © {new Date().getFullYear()} Codeyoung. Personalized 1-on-1 Trial Class Experience.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed for parents &amp; students with care</span>
            <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
