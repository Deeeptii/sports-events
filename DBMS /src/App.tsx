import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizerPanel from './pages/organizer/OrganizerPanel';
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import TeamManagerPanel from './pages/team-manager/TeamManagerPanel';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EventDetails from './pages/events/EventDetails';
import PaymentPage from './pages/payment/PaymentPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import TestSupabase from './components/TestSupabase';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/organizer/*" element={<OrganizerPanel />} />
              <Route path="/participant/*" element={<ParticipantDashboard />} />
              <Route path="/team-manager/*" element={<TeamManagerPanel />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/payment/:eventId" element={<PaymentPage />} />
              <Route path="/payment/success/:eventId" element={<PaymentSuccessPage />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;