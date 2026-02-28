import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Library, Settings, LogOut, Users, FileVideo, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
    { icon: Library, label: 'Modules & Chapitres', path: '/admin/modules' },
    { icon: FileVideo, label: 'Fichiers & Ressources', path: '/admin/resources' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    const getInitials = (name?: string) => {
        if (!name) return 'A';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400 font-bold">Chargement de l'espace administration...</div>;
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/auth" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex h-screen bg-slate-950 font-sans overflow-hidden selection:bg-indigo-500/30">

            {/* Sidebar - Dark Ultra Premium */}
            <aside className="w-[320px] bg-slate-900/50 backdrop-blur-3xl flex flex-col border-r border-slate-800/60 z-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

                <div className="p-8 pb-6 relative z-10">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 transform group-hover:rotate-6 transition-transform border border-indigo-500">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white tracking-tight block">Taalim Admin</span>
                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 block flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-current" /> SuperAdmin Level
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 mb-8 mt-2 relative z-10">
                    <div className="bg-slate-800/50 rounded-[2rem] p-5 border border-slate-700/50 flex items-center gap-4 hover:bg-slate-800 transition-colors cursor-pointer group shadow-inner">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-lg border-2 border-slate-700 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            {getInitials(user?.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-black text-slate-100 leading-tight group-hover:text-emerald-400 transition-colors truncate">{user?.full_name || 'Administrateur'}</p>
                            <p className="text-xs font-bold text-slate-500 mt-1">Accès National</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto hide-scrollbar relative z-10">
                    <div className="px-5 mb-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gestion Cloud</span>
                    </div>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 box-border'
                                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-bold border border-transparent hover:border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-indigo-400'}`} />
                                    <span className={`text-[15px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 relative z-10">
                    <button className="flex items-center gap-4 px-5 py-4 w-full text-left rounded-2xl text-slate-400 hover:text-slate-200 font-bold transition-colors group mb-2 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50">
                        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        Configurations
                    </button>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 font-bold transition-all group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative bg-slate-950">
                <header className="h-28 flex items-center justify-between px-12 z-10 bg-slate-900/80 backdrop-blur-2xl border-b border-slate-800/80 sticky top-0 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            {menuItems.find(m => m.path === location.pathname)?.label || 'Console d\'Administration'}
                        </h1>
                        <p className="text-slate-400 text-[15px] font-medium mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            Système National Opérationnel
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Button variant="outline" className="hidden lg:flex rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-bold px-6 bg-slate-800/30">
                            Générer Rapport Global
                        </Button>
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 relative cursor-pointer hover:text-white transition-colors">
                            <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900"></div>
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-12 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
