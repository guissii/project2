import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Clock, Download, FileText, ChevronRight, Activity, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const recentPdfs = [
    { id: 1, title: 'Limites et Continuité - Cours Complet Officiel', subject: 'Mathématiques', type: 'Cours', size: '2.4 MB', readAt: 'Aujourd\'hui, 14:30', progress: 100 },
    { id: 2, title: 'Mécanique Newtonienne - Examens Nationaux + Corrigés', subject: 'Physique', type: 'Exercices', size: '5.1 MB', readAt: 'Hier, 10:15', progress: 65 },
    { id: 3, title: 'La Boîte à Merveilles - Fiche Analytique Détaillée', subject: 'Français', type: 'Fiche', size: '0.8 MB', readAt: 'Lun, 18:45', progress: 15 },
];

export default function StudentDashboard() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto pb-20">

            {/* Premium Welcome Banner (Stripe / Vercel Vibe) */}
            <div className="relative rounded-[2.5rem] p-10 lg:p-14 text-slate-900 border border-slate-200/60 overflow-hidden shadow-2xl shadow-indigo-900/5 bg-white group">
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-colors duration-1000"></div>
                <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-indigo-600 font-extrabold tracking-widest text-xs mb-6 uppercase bg-indigo-50 px-3 py-1.5 rounded-full w-fit">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Espace SaaS Édudiant
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-[1.1]">
                            Prêt à reprendre le contrôle de votre année, <span className="text-indigo-600">Youssef</span> ?
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                            Votre dernier session était sur la Mécanique Newtonienne. Vous êtes dans le Top 15% des élèves les plus actifs cette semaine. Continuez !
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-full px-8 py-6 font-bold shadow-lg shadow-slate-900/10 transition-all hover:scale-105">
                                Reprendre le cours
                            </Button>
                            <Button variant="outline" className="rounded-full px-8 py-6 font-bold text-slate-700 border-slate-200 hover:bg-slate-50">
                                Explorer le catalogue
                            </Button>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] w-full md:w-[400px] hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group/card flex-shrink-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                                <BookOpen className="w-7 h-7 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900 text-lg">Mécanique Newtonienne</p>
                                <p className="text-slate-500 text-sm font-semibold">Matière: Physique-Chimie</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-500">Progression</span>
                                <span className="text-indigo-600">65% Complété</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
                                <div className="bg-indigo-500 h-full rounded-full relative transition-all duration-1000" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Stats Widgets - Ultra Clean */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { icon: BookOpen, label: "Documents Explorés", value: "42", color: "text-indigo-600", bg: "bg-indigo-50" },
                    { icon: Star, label: "Mis en Favoris", value: "18", color: "text-amber-500", bg: "bg-amber-50" },
                    { icon: Download, label: "Téléchargements", value: "105", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { icon: TrendingUp, label: "Jours Consécutifs", value: "5", color: "text-purple-600", bg: "bg-purple-50" }
                ].map((stat, i) => (
                    <Card key={i} className="border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] hover:shadow-[0_8px_30px_rgb(79,70,229,0.06)] transition-all duration-300 bg-white group cursor-pointer">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</h4>
                                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Récemment consultés - Liste Premium */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Historique de Lecture</h3>
                        <Button variant="outline" className="rounded-full px-6 font-bold text-slate-600">Voir tout l'historique</Button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-4">
                        {recentPdfs.map(pdf => (
                            <div key={pdf.id} className="p-5 rounded-[1.5rem] flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-lg mb-1.5 group-hover:text-indigo-600 transition-colors">{pdf.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-bold text-xs">{pdf.subject}</Badge>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pdf.type}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs font-bold text-slate-500">{pdf.size}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex flex-col items-end gap-2 min-w-[120px]">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{pdf.readAt}</span>
                                        <div className="flex items-center gap-2 w-full justify-end">
                                            <span className="text-xs font-extrabold text-slate-700">{pdf.progress}%</span>
                                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pdf.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full w-10 h-10">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Objectifs & Progression */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Objectifs (2BAC SMA)</h3>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

                        <div className="mb-8">
                            <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">Avancement Global</p>
                            <h4 className="text-5xl font-black tracking-tighter">39<span className="text-3xl text-slate-400">%</span></h4>
                            <p className="text-slate-400 font-medium mt-2">Vous êtes au-dessus de la moyenne nationale (31%).</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <span className="font-bold">Mathématiques</span>
                                    </div>
                                    <span className="font-black text-white">64%</span>
                                </div>
                                <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '64%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-amber-400" />
                                        <span className="font-bold">Physique-Chimie</span>
                                    </div>
                                    <span className="font-black text-white">42%</span>
                                </div>
                                <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-indigo-400" />
                                        <span className="font-bold">SVT</span>
                                    </div>
                                    <span className="font-black text-white">12%</span>
                                </div>
                                <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
