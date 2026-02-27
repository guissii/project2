import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, FileText, PlayCircle, Search, HelpCircle, CloudUpload, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';

type Resource = {
    id: string;
    unit_id: string;
    title: string;
    type: string;
    file_url?: string;
    file_size_kb?: number;
    difficulty?: number;
    duration_min?: number;
    is_premium: boolean;
    is_published: boolean;
    unit_title?: string;
    subject_name?: string;
    grade_code?: string;
    branch_code?: string;
};



export default function ResourcesView() {
    const { token } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        grade_id: '',
        subject_id: '',
        branch_id: '',
        semester: '1',
        unit_title: '',
        unit_description: '',
        is_premium: false,
        is_published: true,
        pdf_cours: '',
        pdf_exercices: '',
        pdf_controles: '',
        pdf_examens: ''
    });

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const [resRes, gradesRes] = await Promise.all([
                fetch('http://localhost:3001/api/admin/resources', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:3001/api/grades', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (resRes.ok) setResources(await resRes.json());
            if (gradesRes.ok) setGrades(await gradesRes.json());
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch branches when grade changes
    useEffect(() => {
        if (!formData.grade_id) {
            setBranches([]);
            return;
        }
        fetch(`http://localhost:3001/api/branches?gradeId=${formData.grade_id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setBranches(data);
                if (data.length === 0) setFormData(prev => ({ ...prev, branch_id: '' }));
            })
            .catch(err => console.error("Failed to fetch branches", err));
    }, [formData.grade_id, token]);

    // Auto-fetch subjects when grade or branch changes
    useEffect(() => {
        if (!formData.grade_id) {
            setSubjects([]);
            return;
        }
        // Only require branch_id if the grade actually has branches
        if (branches.length > 0 && !formData.branch_id) {
            setSubjects([]);
            return;
        }
        fetch(`http://localhost:3001/api/subjects?gradeId=${formData.grade_id}&branchId=${formData.branch_id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setSubjects(data))
            .catch(err => console.error("Failed to fetch subjects", err));
    }, [formData.grade_id, formData.branch_id, branches.length, token]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                // For editing, just update the resource itself using the old flow (for simplicity right now if they click edit on a PDF)
                const res = await fetch(`http://localhost:3001/api/admin/resources/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        title: formData.unit_title,
                        file_url: formData.pdf_cours,
                        is_premium: formData.is_premium,
                        is_published: formData.is_published
                    })
                });
                if (res.ok) { setIsDialogOpen(false); fetchData(); }
                return;
            }

            // 1. Locate or create Course
            let courseId = '';
            // Ideally we fetch courses or just assume we find one. Let's create a Unit directly if we assume the backend handles it.
            // Wait, we need course_id for the unit. Let's fetch the course or prompt an error if does not exist.
            // For now, let's fetch courses to match grade/sub/sem/branch
            let courseSearchUrl = `http://localhost:3001/api/subjects?gradeId=${formData.grade_id}&semester=${formData.semester}`;
            if (formData.branch_id) {
                courseSearchUrl += `&branchId=${formData.branch_id}`;
            }

            const crsRes = await fetch(courseSearchUrl, { headers: { Authorization: `Bearer ${token}` } });
            if (crsRes.ok) {
                const subjs = await crsRes.json();
                const matched = subjs.find((s: any) => s.id === formData.subject_id);
                if (matched && matched.course_id) {
                    courseId = matched.course_id;
                } else {
                    alert("⚠️ Combinaison Classe/Filière/Matière/Semestre introuvable. Assurez-vous d'avoir inséré ce cours dans la BD.");
                    return;
                }
            }

            // 2. Create Unit
            const unitRes = await fetch('http://localhost:3001/api/admin/units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    course_id: courseId,
                    title: formData.unit_title,
                    description: formData.unit_description,
                    is_published: formData.is_published
                })
            });

            if (!unitRes.ok) throw new Error("Erreur création de la section");
            const newUnit = await unitRes.json();

            // 3. Create Resources
            const resourcesToCreate = [
                { type: 'pdf_cours', url: formData.pdf_cours, title: 'Cours - ' + formData.unit_title },
                { type: 'exercices', url: formData.pdf_exercices, title: 'Série d\'exercices - ' + formData.unit_title },
                { type: 'controle_type', url: formData.pdf_controles, title: 'Contrôle - ' + formData.unit_title },
                { type: 'annales', url: formData.pdf_examens, title: 'National - ' + formData.unit_title }
            ];

            for (const res of resourcesToCreate) {
                if (res.url && res.url.trim() !== '' && res.url.trim() !== 'https://') {
                    await fetch('http://localhost:3001/api/admin/resources', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            unit_id: newUnit.id,
                            title: res.title,
                            type: res.type,
                            file_url: res.url,
                            file_size_kb: 1024,
                            difficulty: 3,
                            is_premium: formData.is_premium,
                            is_published: formData.is_published
                        })
                    });
                }
            }

            setIsDialogOpen(false);
            fetchData();

        } catch (err) {
            console.error("Save failed", err);
            alert("Erreur lors de la création.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette ressource ?')) return;
        try {
            const res = await fetch(`http://localhost:3001/api/admin/resources/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const openEdit = (r: Resource) => {
        setEditingId(r.id);
        setFormData({
            grade_id: '',
            subject_id: '',
            branch_id: '',
            semester: '1',
            unit_title: r.title,
            unit_description: '',
            pdf_cours: r.file_url || '',
            pdf_exercices: '',
            pdf_controles: '',
            pdf_examens: '',
            is_premium: r.is_premium,
            is_published: r.is_published
        });
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData({
            grade_id: grades[0]?.id || '',
            subject_id: '',
            branch_id: '',
            semester: '1',
            unit_title: '',
            unit_description: '',
            pdf_cours: 'https://',
            pdf_exercices: 'https://',
            pdf_controles: 'https://',
            pdf_examens: 'https://',
            is_premium: false,
            is_published: true
        });
        setIsDialogOpen(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf_cours': case 'pdf_resume': return <FileText className="w-5 h-5 text-indigo-400" />;
            case 'video_capsule': return <PlayCircle className="w-5 h-5 text-rose-400" />;
            case 'quiz_auto': return <HelpCircle className="w-5 h-5 text-purple-400" />;
            case 'exercices': case 'controle_type': case 'annales': return <Activity className="w-5 h-5 text-emerald-400" />;
            default: return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf_cours': case 'pdf_resume': return 'bg-indigo-500/10 border-indigo-500/30 group-hover:bg-indigo-500/20';
            case 'video_capsule': return 'bg-rose-500/10 border-rose-500/30 group-hover:bg-rose-500/20';
            case 'quiz_auto': return 'bg-purple-500/10 border-purple-500/30 group-hover:bg-purple-500/20';
            case 'exercices': case 'controle_type': case 'annales': return 'bg-emerald-500/10 border-emerald-500/30 group-hover:bg-emerald-500/20';
            default: return 'bg-slate-800 border-slate-700 group-hover:bg-slate-700';
        }
    };

    const getFormatLabel = (type: string) => {
        switch (type) {
            case 'pdf_cours': return 'Support PDF';
            case 'pdf_resume': return 'Résumé PDF';
            case 'video_capsule': return 'Capsule Vidéo';
            case 'exercices': return 'Exercices';
            case 'quiz_auto': return 'Quiz QCM';
            case 'controle_type': return 'Contrôle Type';
            case 'annales': return 'Annales';
            default: return type;
        }
    };

    const filteredResources = resources.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher une ressource..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Chargement des ressources...</div>
                    ) : filteredResources.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 font-bold">Aucune ressource trouvée.</div>
                    ) : (
                        <div className="divide-y divide-slate-800/60">
                            {filteredResources.map((res) => (
                                <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${getTypeColor(res.type)}`}>
                                            {getTypeIcon(res.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-lg text-white mb-2 truncate group-hover:text-indigo-300 transition-colors flex items-center gap-3">
                                                {res.title}
                                                {!res.is_published && (
                                                    <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 uppercase tracking-widest px-2">Brouillon</Badge>
                                                )}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-3 py-1 text-xs">
                                                    {getFormatLabel(res.type)}
                                                </Badge>
                                                <span className="text-slate-600">•</span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.grade_code || 'Toutes Classes'}</span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.subject_name || 'Général'}</span>
                                                {res.branch_code && res.branch_code !== 'COMMON' && (
                                                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-purple-500/30 text-purple-400 bg-purple-500/10 font-bold">
                                                        {res.branch_code}
                                                    </Badge>
                                                )}
                                                <span className="text-slate-600">•</span>
                                                <span className="text-xs font-bold text-indigo-400 truncate max-w-[150px]">{res.unit_title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 border-t border-slate-800/60 md:border-0 pt-4 md:pt-0 shrink-0">
                                        <Badge className={`font-bold px-3 py-1 uppercase tracking-widest text-[10px] border ${res.is_premium ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {res.is_premium ? 'Premium Accès' : 'SaaS Free'}
                                        </Badge>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button onClick={() => openEdit(res)} variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl">
                                                <Edit2 className="w-5 h-5" />
                                            </Button>
                                            <Button onClick={() => handleDelete(res.id)} variant="ghost" size="icon" className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">{editingId ? 'Modifier la Ressource' : 'Nouvelle Section de Cours'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-8 mt-4">

                        {!editingId && (
                            <>
                                {/* ETAPE 1 : CLASSEMENT */}
                                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                    <h3 className="font-bold text-lg text-indigo-400">1. Placement dans le Curriculum</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Niveau (Grade)</label>
                                            <select required value={formData.grade_id} onChange={e => setFormData({ ...formData, grade_id: e.target.value, branch_id: '', subject_id: '' })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                                                <option value="" disabled>Sélectionner un niveau</option>
                                                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                            </select>
                                        </div>
                                        {branches.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-400">Filière</label>
                                                <select required value={formData.branch_id} onChange={e => setFormData({ ...formData, branch_id: e.target.value, subject_id: '' })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                                                    <option value="" disabled>Sélectionner une filière</option>
                                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Matière</label>
                                            <select required value={formData.subject_id} onChange={e => setFormData({ ...formData, subject_id: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                                                <option value="" disabled>Sélectionner une matière</option>
                                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Semestre</label>
                                            <select required value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                                                <option value="1">Semestre 1</option>
                                                <option value="2">Semestre 2</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* ETAPE 2 : DESCRIPTION DU CHAPITRE */}
                                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                    <h3 className="font-bold text-lg text-indigo-400">2. Description de la Section (Chapitre)</h3>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Titre du chapitre / section</label>
                                        <input required value={formData.unit_title} onChange={e => setFormData({ ...formData, unit_title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Ex: Limites et Continuité" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Grande description pédagogique</label>
                                        <textarea rows={4} value={formData.unit_description} onChange={e => setFormData({ ...formData, unit_description: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="Ex: Ce chapitre aborde les concepts de limites, continuité en un point..." />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ETAPE 3 : RESSOURCES */}
                        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                            <h3 className="font-bold text-lg text-indigo-400">{editingId ? 'Document PDF' : '3. Documents PDF (Laissez vide si non applicable)'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Lien PDF du Cours Complet</label>
                                    <input value={formData.pdf_cours} onChange={e => setFormData({ ...formData, pdf_cours: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                </div>
                                {!editingId && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Lien PDF Série d'Exercices</label>
                                            <input value={formData.pdf_exercices} onChange={e => setFormData({ ...formData, pdf_exercices: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Lien PDF Contrôle Type</label>
                                            <input value={formData.pdf_controles} onChange={e => setFormData({ ...formData, pdf_controles: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Lien PDF Examen National (Corrigé)</label>
                                            <input value={formData.pdf_examens} onChange={e => setFormData({ ...formData, pdf_examens: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.is_premium} onChange={e => setFormData({ ...formData, is_premium: e.target.checked })} className="w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900" />
                                <span className="font-bold text-slate-300">Section Premium (Payante)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="w-5 h-5 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-900" />
                                <span className="font-bold text-slate-300">Publié (Visible aux élèves)</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-white">Annuler</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-indigo-600/20">
                                {editingId ? 'Mettre à jour' : 'Créer la Section'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
