import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Shield, Bell, Target, Crown, LogOut, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentSettings() {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Shield className="w-16 h-16 text-slate-300 mb-6" />
                <h2 className="text-2xl font-black text-slate-900 mb-2">Non Connecté</h2>
                <p className="text-slate-500 max-w-sm mb-8">Vous devez avoir un compte étudiant pour accéder aux paramètres.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-300">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Préférences du compte</h1>
                <p className="text-slate-500 font-medium text-[15px]">Gérez vos informations personnelles et votre abonnement en toute simplicité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1 space-y-6 md:space-y-8">
                    <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 border border-white/60 text-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center mt-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 blur-xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-[6px] border-white bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl flex items-center justify-center text-3xl md:text-4xl font-black text-indigo-400 mb-5 group-hover:scale-105 transition-transform duration-500">
                                    {getInitials(user.full_name)}
                                </div>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">{user.full_name}</h2>
                            <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-1.5 mt-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>

                            <Badge className="mt-4 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold px-3 py-1 text-xs">
                                Compte Actif
                            </Badge>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 px-2">Actions Rapides</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)] transition-all duration-300 text-slate-700 font-bold text-[15px] group">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" /> Notifications
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </button>
                            <button onClick={logout} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-rose-50 border border-transparent hover:border-rose-100 hover:text-rose-600 transition-all duration-300 text-slate-700 font-bold text-[15px] group">
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" /> Déconnexion
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6 md:space-y-8">
                    {/* Academic Info */}
                    <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Target className="w-6 h-6 text-indigo-500" /> Parcours Académique
                            </h3>
                            <Button variant="outline" className="rounded-full text-xs font-bold" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Annuler' : 'Modifier'}
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Niveau (Grade)</label>
                                    <div className="block w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-slate-800 font-bold shadow-inner">
                                        {user.grade ? 'Niveau enregistré' : 'Non défini'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Filière</label>
                                    <div className="block w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-slate-800 font-bold shadow-inner flex items-center">
                                        {user.branch ? 'Filière enregistrée' : <span className="text-slate-400">Non défini (Tronc commun)</span>}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-indigo-800">
                                        La modification du parcours académique n'est pas encore disponible. Contactez le support pour mettre à jour votre niveau.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-10 border border-slate-700/50 text-white relative overflow-hidden shadow-2xl shadow-slate-900/10 group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-400/30 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h3 className="text-xl font-black flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6 text-amber-400" /> Plan Actuel
                                </h3>
                                <p className="text-slate-400 font-medium">Vous bénéficiez du plan gratuit national.</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-3xl font-black text-white mb-1">Illimité</div>
                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Ressources</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`inline-block rounded-full ${className}`}>{children}</span>;
}
