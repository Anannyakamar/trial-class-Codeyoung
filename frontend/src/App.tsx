import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout.js';
import { LandingPage } from './pages/LandingPage.js';
import { BookingPage } from './pages/BookingPage.js';
import { ConfirmationPage } from './pages/ConfirmationPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Page 1: Course Catalog Landing Page */}
          <Route index element={<LandingPage />} />
          {/* Page 2: Trial Booking Interface & Confirmation Screen */}
          <Route path="book-trial" element={<BookingPage />} />
          {/* Direct receipt lookup route */}
          <Route path="confirmation/:id" element={<ConfirmationPage />} />
          {/* Legacy /manage redirects to home */}
          <Route path="manage" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
