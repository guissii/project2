import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, FileText, PlayCircle, Filter, Search, HelpCircle, CloudUpload, Activity } from 'lucide-react';

const mockResources = [
    { id: '1', title: 'Limites et Continuité - Cours Complet', type: 'pdf_cours', subject: 'Mathématiques', grade: '2BAC', branch: 'SMA', access: 'standard', isPublished: true },
    { id: '2', title: 'Continuité d\'une fonction (Vidéo par étapes)', type: 'video_capsule', subject: 'Mathématiques', grade: '2BAC', branch: 'SMA', access: 'standard', isPublished: true },
    { id: '3', title: 'Ondes mécaniques - Exercices corrigés', type: 'exercices_progressifs', subject: 'Physique-Chimie', grade: '2BAC', branch: 'SE', access: 'premium', isPublished: false },
    { id: '4', title: 'Quiz Diagnostique : Mouvement', type: 'quiz_auto', subject: 'Physique-Chimie', grade: 'TC', branch: 'COMMON', access: 'standard', isPublished: true },
];

export default function ResourcesView() {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf_cours': return <FileText className="w-5 h-5 text-indigo-400" />;
            case 'video_capsule': return <PlayCircle className="w-5 h-5 text-rose-400" />;
            case 'quiz_auto': return <HelpCircle className="w-5 h-5 text-purple-400" />;
            case 'exercices_progressifs': return <Activity className="w-5 h-5 text-emerald-400" />;
            default: return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf_cours': return 'bg-indigo-500/10 border-indigo-500/30 group-hover:bg-indigo-500/20';
            case 'video_capsule': return 'bg-rose-500/10 border-rose-500/30 group-hover:bg-rose-500/20';
            case 'quiz_auto': return 'bg-purple-500/10 border-purple-500/30 group-hover:bg-purple-500/20';
            case 'exercices_progressifs': return 'bg-emerald-500/10 border-emerald-500/30 group-hover:bg-emerald-500/20';
            default: return 'bg-slate-800 border-slate-700 group-hover:bg-slate-700';
        }
    };

    const getFormatLabel = (type: string) => {
        switch (type) {
            case 'pdf_cours': return 'Support PDF';
            case 'video_capsule': return 'Capsule Vidéo';
            case 'exercices_progressifs': return 'Exercices';
            case 'quiz_auto': return 'Quiz QCM';
            case 'controle_type': return 'Contrôle Type';
            default: return type;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Bibliothèque Cloud</h2>
                    <p className="text-slate-400 mt-2 font-medium">Gestion décentralisée des documents, vidéos et quiz nationaux.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full font-bold px-6 shadow-sm">
                        <CloudUpload className="w-4 h-4 mr-2" /> Import Massif
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvelle Ressource
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher une ressource..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Type
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Niveau
                        </Button>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="divide-y divide-slate-800/60">
                        {mockResources.map((res) => (
                            <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">

                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${getTypeColor(res.type)}`}>
                                        {getTypeIcon(res.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-lg text-white mb-2 truncate group-hover:text-indigo-300 transition-colors flex items-center gap-3">
                                            {res.title}
                                            {!res.isPublished && (
                                                <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 uppercase tracking-widest px-2">Brouillon</Badge>
                                            )}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-3 py-1 text-xs">
                                                {getFormatLabel(res.type)}
                                            </Badge>
                                            <span className="text-slate-600">•</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.grade}</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.subject}</span>
                                            {res.branch !== 'COMMON' && (
                                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-purple-500/30 text-purple-400 bg-purple-500/10 font-bold">
                                                    {res.branch}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 border-t border-slate-800/60 md:border-0 pt-4 md:pt-0 shrink-0">
                                    <Badge className={`font-bold px-3 py-1 uppercase tracking-widest text-[10px] border ${res.access === 'premium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                        {res.access === 'premium' ? 'Premium Accès' : 'SaaS Free'}
                                    </Badge>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl">
                                            <Edit2 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
