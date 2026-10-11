import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout.js';
import { LandingPage } from './pages/LandingPage.js';
import { BookingPage } from './pages/BookingPage.js';
import { ConfirmationPage } from './pages/ConfirmationPage.js';
import { ManageBookingPage } from './pages/ManageBookingPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="book-trial" element={<BookingPage />} />
          <Route path="confirmation/:id" element={<ConfirmationPage />} />
          <Route path="manage" element={<ManageBookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
