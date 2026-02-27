import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Star, Clock, Settings, LogOut, ChevronRight, Zap, Target, BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
    { path: '/student', icon: Home, label: 'Tableau de bord' },
    { path: '/student/search', icon: Search, label: 'Bibliothèque & Recherche' },
    { path: '/student/favorites', icon: Star, label: 'Mes Favoris' },
    { path: '/student/history', icon: Clock, label: 'Historique de lecture' },
    { path: '/student/settings', icon: Settings, label: 'Préférences du compte' },
];

export default function StudentLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const SidebarContent = () => (
        <>
            {/* Brand Header */}
            <div className="p-6 md:p-8 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[1rem] md:rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)] transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight block group-hover:text-indigo-600 transition-colors">Taalim.</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">SaaS Étudiant</span>
                    </div>
                </div>
                {/* Close Button Mobile */}
                <button onClick={toggleMobileMenu} className="lg:hidden text-slate-400 hover:text-slate-900">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* User Profile Box - Focus on Status */}
            <div className="px-4 md:px-6 mb-6 md:mb-8 mt-4 relative">
                {user ? (
                    <div onClick={() => { navigate('/student/settings'); toggleMobileMenu(); }} className="bg-white/80 backdrop-blur-md rounded-3xl p-3 md:p-4 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-indigo-400 blur-md rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 font-black text-sm md:text-base border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                {getInitials(user.full_name)}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] md:text-[15px] font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">{user.full_name} <span className="text-base group-hover:animate-bounce inline-block">👑</span></p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Target className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors truncate">Objectif Médecine</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 border border-slate-200 flex flex-col items-center text-center gap-3 backdrop-blur-md">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-200/50 flex items-center justify-center border border-slate-300/50">
                            <Star className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[14px] md:text-[15px] font-black text-slate-900 leading-tight">Mode Visiteur</p>
                            <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-1">Connectez-vous pour tout débloquer</p>
                        </div>
                        <Link to="/login" className="w-full mt-1">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-[13px] font-bold h-10 transition-all hover:scale-[1.02]">
                                M'identifier
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Navigation - High Spacing */}
            <nav className="flex-1 px-2 md:px-4 space-y-1 overflow-y-auto hide-scrollbar pb-6">
                <div className="px-4 mb-3">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation Principale</span>
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/student');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-4 py-3 md:px-5 md:py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-indigo-50/80 text-indigo-700 shadow-sm border border-indigo-100/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-bold border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-600' : 'group-hover:scale-110 group-hover:text-indigo-400'}`} />
                                <span className={`text-[13px] md:text-[15px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                            </div>
                            {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Area */}
            <div className="p-4 md:p-6 mt-auto border-t border-slate-100">
                {user ? (
                    <button onClick={logout} className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-400 hover:text-rose-600 font-bold text-sm md:text-base transition-colors group">
                        <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:text-rose-500 transition-colors" />
                        Déconnexion
                    </button>
                ) : (
                    <Link to="/login" className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-400 hover:text-indigo-600 font-bold text-sm md:text-base transition-colors group">
                        <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:text-indigo-500 transition-colors rotate-180" />
                        Se connecter
                    </Link>
                )}
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#fafafa] font-sans selection:bg-indigo-200 overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Sidebar - Desktop & Mobile */}
            <aside className={`
                // Update sidebar look to be slightly transparent
                w-[280px] md:w-[320px] bg-white/60 backdrop-blur-xl flex flex-col 
                shadow-[8px_0_30px_rgba(0,0,0,0.03)] border-r border-white/60
                transition-transform duration-300 ease-in-out z-40
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-[#f8faff] before:absolute before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-[0.03] before:pointer-events-none">
                <header className="h-20 md:h-28 flex items-center justify-between px-6 md:px-12 z-20 bg-white/40 backdrop-blur-3xl border-b border-white border-opacity-50 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-none">
                                {menuItems.find(i => i.path === location.pathname)?.label || 'Espace Étudiant'}
                            </h2>
                            <p className="text-slate-500 text-[11px] md:text-[15px] font-medium mt-0.5 md:mt-1 hidden sm:block">L'accès premium vers l'excellence académique.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Gen-Z Gamification Stats */}
                        <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 h-10 md:h-12 shadow-sm">
                            <div className="flex items-center gap-1.5 font-black text-amber-500 text-sm">
                                <span className="text-base">🔥</span> 12 <span className="text-[10px] uppercase tracking-wider text-slate-400">Jours</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <div className="flex items-center gap-1.5 font-black text-indigo-600 text-sm">
                                <Zap className="w-4 h-4 fill-indigo-500" /> 1450 <span className="text-[10px] uppercase tracking-wider text-slate-400">XP</span>
                            </div>
                        </div>

                        <div className="relative hidden xl:flex items-center w-64 2xl:w-80 group">
                            <Search className="w-5 h-5 absolute left-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input type="text" placeholder="Recherche rapide (Ctrl+K)" className="pl-14 pr-5 py-3 md:py-4 w-full border border-slate-200 hover:border-slate-300 rounded-full text-[13px] md:text-[15px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-400 transition-all shadow-sm font-semibold placeholder:text-slate-400 placeholder:font-medium" />
                        </div>
                        <Button size="icon" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 shadow-sm relative shrink-0">
                            <div className="absolute top-[2px] right-[2px] md:top-1 md:right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-100"></div>
                            <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-12 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
