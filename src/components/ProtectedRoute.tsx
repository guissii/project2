import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Rediriger vers la page de connexion tout en sauvegardant la page d'origine
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Si accède à une page normale du dashboard sans avoir fait l'onboarding
    if (user && !user.onboarding_completed && location.pathname !== '/student/onboarding') {
        return <Navigate to="/student/onboarding" replace />;
    }

    // Si essaie d'accéder à l'onboarding alors qu'il l'a déjà fait
    if (user && user.onboarding_completed && location.pathname === '/student/onboarding') {
        return <Navigate to="/student" replace />;
    }

    return <Outlet />;
}
