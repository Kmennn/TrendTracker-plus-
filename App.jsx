import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Saved from './pages/Saved';
import TrendDetails from './pages/TrendDetails';
import TrendRadar from './pages/TrendRadar';
import KeywordComparison from './pages/KeywordComparison';
import RegionalMap from './pages/RegionalMap';
import AIChat from './pages/AIChat';
import ReportsModule from './pages/ReportsModule';
import AdminPanel from './pages/AdminPanel';
import UserSettings from './pages/UserSettings';
import Navbar from './components/Navbar';
import GoogleTrends from './pages/GoogleTrends';
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
        <div className="min-h-screen bg-gray-900 text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/trend/:id" element={<ProtectedRoute><><Navbar /><TrendDetails /></></ProtectedRoute>} />
            <Route path="/trend-details/:regionName" element={<ProtectedRoute><><Navbar /><TrendDetails /></></ProtectedRoute>} />
            <Route path="/radar" element={<ProtectedRoute><><Navbar /><TrendRadar /></></ProtectedRoute>} />
            <Route path="/comparison" element={<ProtectedRoute><><Navbar /><KeywordComparison /></></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><><Navbar /><RegionalMap /></></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><><Navbar /><AIChat /></></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><><Navbar /><ReportsModule /></></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><><Navbar /><AdminPanel /></></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><><Navbar /><UserSettings /></></ProtectedRoute>} />
            <Route path="/google-trends" element={<ProtectedRoute><><Navbar /><GoogleTrends /></></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
