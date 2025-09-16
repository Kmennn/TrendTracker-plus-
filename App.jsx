import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage'; // UPDATED: Import the new AlertsPage
import Saved from './pages/Saved';
import TrendDetails from './pages/TrendDetails';
import TrendRadar from './pages/TrendRadar';
import KeywordComparison from './pages/KeywordComparison';
import RegionalMap from './pages/RegionalMap';
import AIChat from './pages/AIChat';
import ReportsModule from './pages/ReportsModule';
import AdminPanel from './pages/AdminPanel';
import UserSettings from './pages/UserSettings';
import ProtectedLayout from './components/ProtectedLayout';
import GoogleTrends from './pages/GoogleTrends';
import MarketsPage from './pages/MarketsPage';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Protected routes with main layout */}
          <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/markets" element={<MarketsPage />} />
            {/* --- UPDATED: Route now points to the new AlertsPage --- */}
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/trend/:id" element={<TrendDetails />} />
            <Route path="/trend-details/:regionName" element={<TrendDetails />} />
            <Route path="/radar" element={<TrendRadar />} />
            <Route path="/comparison" element={<KeywordComparison />} />
            <Route path="/map" element={<RegionalMap />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/reports" element={<ReportsModule />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* --- FIXED: Corrected typo in Route tag --- */}
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/google-trends" element={<GoogleTrends />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
