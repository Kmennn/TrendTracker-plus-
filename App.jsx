import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SmoothScrollProvider, MotionConfigProvider, CanvasProvider } from './providers';
import ErrorBoundary from './components/ErrorBoundary';
import queryClient from './lib/queryClient';
import './index.css';


const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const Saved = lazy(() => import('./pages/Saved'));
const TrendDetails = lazy(() => import('./pages/TrendDetails'));
const TrendRadar = lazy(() => import('./pages/TrendRadar'));
const KeywordComparison = lazy(() => import('./pages/KeywordComparison'));
const RegionalMap = lazy(() => import('./pages/RegionalMap'));
const AIChat = lazy(() => import('./pages/AIChat'));
const ReportsModule = lazy(() => import('./pages/ReportsModule'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const GoogleTrends = lazy(() => import('./pages/GoogleTrends'));
const MarketsPage = lazy(() => import('./pages/MarketsPage'));
const AppShell = lazy(() => import('./components/AppShell'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MotionConfigProvider>
          <SmoothScrollProvider>
            <CanvasProvider>

            <AuthProvider>
            <Router basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

                    {/* Protected routes with AppShell */}
                    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/markets" element={<MarketsPage />} />
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
                      <Route path="/settings" element={<UserSettings />} />
                      <Route path="/google-trends" element={<GoogleTrends />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </AuthProvider>
          </CanvasProvider>
        </SmoothScrollProvider>
      </MotionConfigProvider>
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
    </ErrorBoundary>
  );
}


export default App;

