import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Star, Clock, Settings, LogOut, ChevronRight, Zap, Target, BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems = [
    { path: '/student', icon: Home, label: 'Tableau de bord' },
    { path: '/student/search', icon: Search, label: 'Bibliothèque & Recherche' },
    { path: '/student/favorites', icon: Star, label: 'Mes Favoris' },
    { path: '/student/history', icon: Clock, label: 'Historique de lecture' },
    { path: '/student/settings', icon: Settings, label: 'Préférences du compte' },
];

export default function StudentLayout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const SidebarContent = () => (
        <>
            {/* Brand Header */}
            <div className="p-6 md:p-8 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 transform group-hover:-rotate-3 transition-transform">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight block">Taalim.</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">SaaS Étudiant</span>
                    </div>
                </div>
                {/* Close Button Mobile */}
                <button onClick={toggleMobileMenu} className="lg:hidden text-slate-400 hover:text-slate-900">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* User Profile Box - Focus on Status */}
            <div className="px-4 md:px-6 mb-6 md:mb-8 mt-2">
                <div className="bg-indigo-50/50 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 border border-indigo-100 flex items-center gap-3 md:gap-4 hover:bg-indigo-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150')] bg-cover bg-center border-2 border-white shadow-sm group-hover:scale-105 transition-transform"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[14px] md:text-[15px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors truncate">Safia Alami 👑</p>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                            <Target className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                            <p className="text-[10px] md:text-xs font-bold text-rose-600 truncate">Objectif Medecine</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-indigo-300 shrink-0" />
                </div>
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
                            className={`flex items-center justify-between px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-bold'
                                }`}
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:scale-110 group-hover:text-indigo-500'}`} />
                                <span className={`text-[13px] md:text-[15px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Area with Promo/Action */}
            <div className="p-4 md:p-6 mt-auto">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white mb-4 md:mb-6 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-300 mb-3 md:mb-4 fill-amber-300" />
                    <h4 className="font-black text-base md:text-lg mb-1 md:mb-2">Exams Nationaux</h4>
                    <p className="text-indigo-100 text-xs md:text-sm font-medium mb-3 md:mb-4 leading-relaxed">Sujets et corrigés 2023 dispos.</p>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold rounded-xl shadow-sm h-9 md:h-10 text-sm">
                        Consulter
                    </Button>
                </div>

                <button className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-slate-400 hover:text-rose-600 font-bold text-sm md:text-base transition-colors group">
                    <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:text-rose-500 transition-colors" />
                    Déconnexion
                </button>
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
                fixed lg:static inset-y-0 left-0 z-40
                w-[280px] md:w-[320px] bg-white flex flex-col 
                shadow-[8px_0_30px_rgba(0,0,0,0.02)] border-r border-slate-200/50
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                <header className="h-20 md:h-28 flex items-center justify-between px-6 md:px-12 z-20 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shrink-0">
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
