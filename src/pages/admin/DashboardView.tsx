import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users, Eye, TrendingUp,
    Activity, FileText, Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardView() {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        resources: 0,
        downloads: 0,
        consultations: 0
    });

    useEffect(() => {
        if (!token) return;
        fetch('http://localhost:3001/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, [token]);

    const metrics = [
        { title: "Élèves Inscrits", value: stats.students.toLocaleString(), icon: Users, trend: "+12.5%", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { title: "Documents PDF", value: stats.resources.toLocaleString(), icon: FileText, trend: "+5.2%", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { title: "Téléchargements", value: stats.downloads.toLocaleString(), icon: Download, trend: "+24.8%", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { title: "Consultations Vues", value: stats.consultations.toLocaleString(), icon: Eye, trend: "+18.3%", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">

            {/* KPI Stats - Ultra Dark Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {metrics.map((stat, i) => (
                    <Card key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-xl rounded-[2rem] hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer overflow-hidden relative">
                        <div className={`absolute -right-10 -top-10 w-40 h-40 ${stat.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
                        <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between gap-6">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center`}>
                                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-500/20">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">{stat.title}</p>
                                <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart Area Placeholder */}
                <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/80">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Trafic & Engagements</h3>
                            <p className="text-slate-400 font-medium mt-1">Évolution des téléchargements sur les 30 derniers jours</p>
                        </div>
                        <select className="bg-slate-800 border-none text-white text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                            <option>30 Derniers Jours</option>
                            <option>Cette Semaine</option>
                            <option>Cette Année</option>
                        </select>
                    </div>
                    <CardContent className="p-8 h-[400px] flex flex-col justify-center items-center relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

                        {/* Fake Chart bars for visual effect */}
                        <div className="w-full h-64 flex items-end justify-between px-4 gap-2 relative z-10">
                            {[40, 60, 45, 80, 50, 90, 100, 70, 85, 65, 40, 55].map((h, i) => (
                                <div key={i} className="w-full bg-slate-800/80 rounded-t-md hover:bg-indigo-500/50 transition-colors cursor-pointer relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                        {(h * 1234).toLocaleString()} Vues
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed Pipeline */}
                <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-800/60 bg-slate-900/80">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <Activity className="w-6 h-6 text-indigo-500" /> Flux d'Activité
                        </h3>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-800/60">
                            {[
                                { message: 'Nouveau cours téléchargé par user_39x', time: 'il y a 2 min', type: 'download' },
                                { message: 'Mise à jour: Examen National SVT 2023', time: 'il y a 15 min', type: 'update' },
                                { message: 'Nouveau lot de 500 résumés indexés', time: 'il y a 1h', type: 'system' },
                                { message: 'Serveur CDN Rabat mis à l\'échelle', time: 'il y a 3h', type: 'infra' },
                                { message: 'Signale: Lien corrompu (Physique 1BAC)', time: 'il y a 4h', type: 'alert' }
                            ].map((log, i) => (
                                <div key={i} className="p-6 flex gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_10px_currentColor] ${log.type === 'download' ? 'bg-emerald-500 text-emerald-500' :
                                        log.type === 'update' ? 'bg-blue-500 text-blue-500' :
                                            log.type === 'alert' ? 'bg-rose-500 text-rose-500' : 'bg-purple-500 text-purple-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-slate-300 font-medium text-[15px] leading-snug group-hover:text-white transition-colors">{log.message}</p>
                                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wide">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-800/60 bg-slate-900/80">
                            <Button variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-bold">
                                Afficher les logs complets
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
