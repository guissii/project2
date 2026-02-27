import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Layers, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CurriculumView() {
    const { token } = useAuth();
    const [grades, setGrades] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        Promise.all([
            fetch('http://localhost:3001/api/grades', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
            fetch('http://localhost:3001/api/branches', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()), // wait this route requires gradeId normally
            fetch('http://localhost:3001/api/subjects', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
        ]).then(([gradesData, branchesData, subjectsData]) => {
            setGrades(gradesData);
            setBranches(branchesData);
            setSubjects(subjectsData);
        }).catch(err => console.error("Failed to load curriculum data", err));
    }, [token]);
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Curriculum National</h2>
                    <p className="text-slate-400 mt-2 font-medium">Structure architecturale du programme d'enseignement marocain.</p>
                </div>
            </div>

            <Tabs defaultValue="grades" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-8 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
                    <TabsTrigger value="grades" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold transition-all data-[state=active]:shadow-lg">
                        <Layers className="w-4 h-4 mr-2" />
                        Niveaux & Cycles
                    </TabsTrigger>
                    <TabsTrigger value="branches" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold transition-all data-[state=active]:shadow-lg">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Filières
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold transition-all data-[state=active]:shadow-lg">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Matières
                    </TabsTrigger>
                </TabsList>

                {/* ONGLET : NIVEAUX */}
                <TabsContent value="grades" className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
                        <div>
                            <h3 className="text-xl font-bold text-white">Gestion des Niveaux</h3>
                            <p className="text-sm text-slate-500 mt-1">Définition des étapes clés de l'apprentissage.</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Niveau
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grades.map((grade) => (
                            <div key={grade.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all group flex flex-col justify-between min-h-[160px]">
                                <div className="flex justify-between items-start">
                                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:border-indigo-500/30 font-mono transition-colors">
                                        {grade.code}
                                    </Badge>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cycle non défini</p>
                                    <h4 className="text-xl font-black text-white">{grade.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* ONGLET : FILIERES */}
                <TabsContent value="branches" className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
                        <div>
                            <h3 className="text-xl font-bold text-white">Catalogue des Filières</h3>
                            <p className="text-sm text-slate-500 mt-1">Spécialisations disponibles pour les lycéens.</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Filière
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {branches.map((branch) => (
                            <div key={branch.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2rem] hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 font-mono text-sm">
                                        {branch.code}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <h4 className="text-2xl font-black text-white mb-6 leading-tight relative z-10">{branch.name}</h4>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Niveaux Assignés</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(branch.grades || []).map((g: string) => (
                                            <Badge key={g} variant="outline" className="bg-slate-950 border-slate-800 text-slate-400">
                                                {g}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* ONGLET : MATIERES */}
                <TabsContent value="subjects" className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
                        <div>
                            <h3 className="text-xl font-bold text-white">Référentiel des Matières</h3>
                            <p className="text-sm text-slate-500 mt-1">Disciplines fondamentales du curriculum.</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Matière
                        </Button>
                    </div>

                    <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-800/60">
                                {subjects.map((sub) => (
                                    <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-slate-800/40 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center font-black text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-inner">
                                                {sub.code}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">{sub.name}</h4>
                                                <p className="text-[15px] font-bold text-slate-500 font-arabic mt-1" dir="rtl">{sub.nameAr}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
