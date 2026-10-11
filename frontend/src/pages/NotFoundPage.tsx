import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-slate-800">404</h1>
      <p className="text-slate-600">Page not found</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};
