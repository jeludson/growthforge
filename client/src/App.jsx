import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import WebsiteAudit from './pages/dashboard/WebsiteAudit';
import SEOAnalyzer from './pages/dashboard/SEOAnalyzer';
import PerformanceAnalyzer from './pages/dashboard/PerformanceAnalyzer';
import CompetitorsPage from './pages/dashboard/CompetitorsPage';
import LeadsPage from './pages/dashboard/LeadsPage';
import AIAssistantPage from './pages/dashboard/AIAssistantPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import DemoReportPage from './pages/DemoReportPage';
import LoadingScreen from './components/ui/LoadingScreen';
import AdminDashboard from './pages/admin/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const OnboardedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
};

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/demo-report" element={<DemoReportPage />} />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <OnboardedRoute>
              <DashboardLayout />
            </OnboardedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="audit" element={<WebsiteAudit />} />
          <Route path="seo" element={<SEOAnalyzer />} />
          <Route path="performance" element={<PerformanceAnalyzer />} />
          <Route path="competitors" element={<CompetitorsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="assistant" element={<AIAssistantPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
