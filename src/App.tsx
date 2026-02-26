import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

/* Admin Routes */
import AdminLayout from './pages/admin/AdminLayout';
import DashboardView from './pages/admin/DashboardView';
import CurriculumView from './pages/admin/CurriculumView';
import ResourcesView from './pages/admin/ResourcesView';
import UnitsView from './pages/admin/UnitsView';
import UsersView from './pages/admin/UsersView';

/* Student Routes */
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSearch from './pages/student/StudentSearch';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page publique */}
        <Route path="/" element={<LandingPage />} />

        {/* Espace Élève (Nouveau SaaS principal) */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="search" element={<StudentSearch />} />
          <Route path="favorites" element={<div className="flex items-center justify-center h-full text-slate-400">Favoris en cours de construction</div>} />
          <Route path="history" element={<div className="flex items-center justify-center h-full text-slate-400">Historique en cours de construction</div>} />
          <Route path="settings" element={<div className="flex items-center justify-center h-full text-slate-400">Paramètres en cours de construction</div>} />
        </Route>

        {/* Interface d'Administration (Gestion Nationale) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="curriculum" element={<CurriculumView />} />
          <Route path="resources" element={<ResourcesView />} />
          <Route path="units" element={<UnitsView />} />
          <Route path="users" element={<UsersView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
