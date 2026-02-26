import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Library, Link as LinkIcon, Search, Filter } from 'lucide-react';

const mockUnits = [
    { id: '1', ref: 'MATH-A-27', title: 'Limites et Continuité', course: '2BAC SMA - Mathématiques', order: 1, season: 'S1', isPublished: true, resourcesCount: 5 },
    { id: '2', ref: 'PC-ELEC-19', title: 'Réponse d\'un dipôle RC à un échelon', course: '2BAC SE - Physique-Chimie', order: 3, season: 'S2', isPublished: true, resourcesCount: 8 },
    { id: '3', ref: 'SVT-GEN-01', title: 'Les lois statistiques de la transmission', course: '2BAC SE - SVT', order: 2, season: 'S1', isPublished: false, resourcesCount: 2 },
    { id: '4', ref: 'FR-LETT-04', title: 'Le Roman Maghrébin d\'expression française', course: '1BAC - Français', order: 4, season: 'S2', isPublished: true, resourcesCount: 3 },
    { id: '5', ref: 'MATH-C-01', title: 'Théorème de Thalès et Pythagore', course: '3AC - Mathématiques', order: 1, season: 'S1', isPublished: true, resourcesCount: 4 },
];

export default function UnitsView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Structure des Chapitres</h2>
                    <p className="text-slate-400 mt-2 font-medium">Orchestration du plan de cours et des liaisons de ressources.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        Nouveau Chapitre
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher (ex: MATH-A-27)..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Matière
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Semestre
                        </Button>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="divide-y divide-slate-800/60">
                        {mockUnits.map((unit) => (
                            <div key={unit.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">
                                <div className="flex items-start gap-6 flex-1 min-w-0">
                                    <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-inner shrink-0">
                                        <Library className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-lg text-white mb-2 truncate group-hover:text-indigo-300 transition-colors flex items-center gap-3">
                                            <span className="text-[13px] font-mono text-slate-500 group-hover:text-indigo-400">[{unit.ref}]</span>
                                            {unit.title}
                                            {!unit.isPublished && (
                                                <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 uppercase tracking-widest px-2">Brouillon</Badge>
                                            )}
                                        </h4>
                                        <p className="text-[15px] font-bold text-slate-400 mb-2 truncate">{unit.course}</p>
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-3 py-1 text-xs">
                                                Ordre: #{unit.order}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-3 py-1 text-xs">
                                                Semestre: {unit.season}
                                            </Badge>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 text-xs flex items-center gap-1.5">
                                                <LinkIcon className="w-3.5 h-3.5" />
                                                {unit.resourcesCount} Ressources Attachées
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 border-t border-slate-800/60 md:border-0 pt-4 md:pt-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl">
                                        <Edit2 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
