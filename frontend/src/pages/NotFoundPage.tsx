import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
      <h1 className="text-7xl font-black text-charcoal-900 font-display">404</h1>
      <p className="text-charcoal-600 font-medium">The page you are looking for could not be found.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-coral-500 text-white font-bold hover:bg-coral-600 transition-all shadow-coral-glow"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};
