import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

/* Auth Routes */
import AuthPage from './pages/AuthPage';

/* Admin Routes */
import AdminLayout from './pages/admin/AdminLayout';
import DashboardView from './pages/admin/DashboardView';
import ResourcesView from './pages/admin/ResourcesView';
import ModulesView from './pages/admin/ModulesView';
import UsersView from './pages/admin/UsersView';

/* Student Routes */
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSearch from './pages/student/StudentSearch';
import OnboardingPage from './pages/student/OnboardingPage';
import ResourceViewer from './pages/student/ResourceViewer';
import StudentSettings from './pages/student/StudentSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page publique */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Espace Élève Protégé (Nouveau SaaS principal) */}
          <Route path="/student" element={<ProtectedRoute />}>
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="search" element={<StudentSearch />} />
              <Route path="favorites" element={<div className="flex items-center justify-center h-full text-slate-400">Favoris en cours de construction</div>} />
              <Route path="history" element={<div className="flex items-center justify-center h-full text-slate-400">Historique en cours de construction</div>} />
              <Route path="settings" element={<StudentSettings />} />
              <Route path="resource/:id" element={<ResourceViewer />} />
            </Route>
          </Route>

          {/* Interface d'Administration (Gestion Nationale) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="resources" element={<ResourcesView />} />
            <Route path="modules" element={<ModulesView />} />
            <Route path="users" element={<UsersView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
