import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, FileText, PlayCircle, Search, HelpCircle, Activity, ArrowLeft, ChevronRight, GraduationCap, GitBranch, BookOpen, Library, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';

type Module = {
    id: string;
    title: string;
    subject: string;
    tags: string[];
};

type Resource = {
    id: string;
    module_id: string;
    title: string;
    type: string;
    file_url?: string;
    is_premium: boolean;
    is_published: boolean;
    module_title?: string;
    subject_name?: string;
    tags?: string[];
};

// ════════════════════════════════════════════════════════════════
// Moroccan Education System Hierarchy
// ════════════════════════════════════════════════════════════════
const CYCLES = [
    { code: 'Lycée', label: 'Lycée (Secondaire Qualifiant)', icon: '🎓' },
    { code: 'Collège', label: 'Collège (Secondaire Collégial)', icon: '📚' },
    { code: 'Primaire', label: 'Primaire (Enseignement Primaire)', icon: '✏️' },
];

const GRADES: Record<string, { code: string; label: string }[]> = {
    'Lycée': [{ code: 'TC', label: 'Tronc Commun' }, { code: '1BAC', label: '1ère Année Bac' }, { code: '2BAC', label: '2ème Année Bac' }],
    'Collège': [{ code: '1AC', label: '1ère Année Collège' }, { code: '2AC', label: '2ème Année Collège' }, { code: '3AC', label: '3ème Année Collège' }],
    'Primaire': [{ code: '1AP', label: '1ère Année' }, { code: '2AP', label: '2ème Année' }, { code: '3AP', label: '3ème Année' }, { code: '4AP', label: '4ème Année' }, { code: '5AP', label: '5ème Année' }, { code: '6AP', label: '6ème Année' }],
};

const BRANCHES: Record<string, { code: string; label: string }[]> = {
    'TC': [{ code: 'TC_SCI', label: 'Tronc Commun Sciences' }, { code: 'TC_TECH', label: 'Tronc Commun Technologique' }, { code: 'TC_LET', label: 'Tronc Commun Lettres' }],
    '1BAC': [{ code: 'SMA', label: 'Sciences Math A' }, { code: 'SMB', label: 'Sciences Math B' }, { code: 'SE', label: 'Sciences Expérimentales' }, { code: 'LET', label: 'Lettres et Sciences Humaines' }],
    '2BAC': [{ code: 'SMA', label: 'Sciences Math A' }, { code: 'SMB', label: 'Sciences Math B' }, { code: 'PC', label: 'Sciences Physiques-Chimie' }, { code: 'SVT', label: 'Sciences de la Vie et Terre' }, { code: 'LET', label: 'Lettres et Sciences Humaines' }],
};

const SEMESTERS = [{ code: 'S1', label: 'Semestre 1' }, { code: 'S2', label: 'Semestre 2' }];

type NavStep = 'cycle' | 'grade' | 'branch' | 'subject' | 'semester' | 'modules';

export default function ResourcesView() {
    const { token } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Navigation state
    const [step, setStep] = useState<NavStep>('cycle');
    const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        module_id: '',
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
            const [resRes, modRes] = await Promise.all([
                fetch('/api/admin/resources', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/admin/modules', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (resRes.ok) setResources(await resRes.json());
            if (modRes.ok) setModules(await modRes.json());
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDriveLink = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com/file/d/')) {
            return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
        }
        return url;
    };

    // ── Navigation Logic ──
    const selectCycle = (c: string) => { setSelectedCycle(c); setStep('grade'); };
    const selectGrade = (g: string) => {
        setSelectedGrade(g);
        const branches = BRANCHES[g];
        if (branches && branches.length > 0) setStep('branch');
        else setStep('subject');
    };
    const selectBranch = (b: string) => { setSelectedBranch(b); setStep('subject'); };
    const selectSubject = (s: string) => { setSelectedSubject(s); setStep('semester'); };
    const selectSemester = (s: string) => { setSelectedSemester(s); setStep('modules'); };

    const goBack = () => {
        if (step === 'modules') { setSelectedSemester(null); setStep('semester'); }
        else if (step === 'semester') { setSelectedSubject(null); setStep('subject'); }
        else if (step === 'subject') {
            if (selectedBranch) { setSelectedBranch(null); setStep('branch'); }
            else { setSelectedGrade(null); setStep('grade'); }
        }
        else if (step === 'branch') { setSelectedGrade(null); setStep('grade'); }
        else if (step === 'grade') { setSelectedCycle(null); setStep('cycle'); }
    };

    const resetAll = () => {
        setSelectedCycle(null); setSelectedGrade(null); setSelectedBranch(null);
        setSelectedSubject(null); setSelectedSemester(null); setStep('cycle');
    };

    // ── Derived Component Data ──
    const availableSubjects = useMemo(() => {
        let mods = modules;
        if (selectedCycle) mods = mods.filter(m => m.tags?.includes(selectedCycle));
        if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
        if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
        return Array.from(new Set(mods.map(m => m.subject))).sort();
    }, [modules, selectedCycle, selectedGrade, selectedBranch]);

    const filteredModulesInSemester = useMemo(() => {
        let mods = modules;
        if (selectedCycle) mods = mods.filter(m => m.tags?.includes(selectedCycle));
        if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
        if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
        if (selectedSubject) mods = mods.filter(m => m.subject === selectedSubject);
        if (selectedSemester) mods = mods.filter(m => m.tags?.includes(selectedSemester));
        return mods;
    }, [modules, selectedCycle, selectedGrade, selectedBranch, selectedSubject, selectedSemester]);

    const activeResources = useMemo(() => {
        let mods = filteredModulesInSemester.map(m => m.id);
        const res = resources.filter(r => mods.includes(r.module_id));
        if (searchTerm) {
            return res.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return res;
    }, [filteredModulesInSemester, resources, searchTerm]);

    // ── Form Handling ──
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await fetch(`/api/admin/resources/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        file_url: formatDriveLink(formData.pdf_cours),
                        is_premium: formData.is_premium,
                        is_published: formData.is_published
                    })
                });
                if (res.ok) { setIsDialogOpen(false); fetchData(); }
                return;
            }

            if (!formData.module_id) {
                alert("⚠️ Veuillez sélectionner un module/chapitre existant.");
                return;
            }

            const selectedMod = modules.find(m => m.id === formData.module_id);
            if (!selectedMod) return;

            const resourcesToCreate = [
                { type: 'pdf_cours', url: formatDriveLink(formData.pdf_cours), title: 'Cours - ' + selectedMod.title },
                { type: 'exercices', url: formatDriveLink(formData.pdf_exercices), title: 'Série d\'exercices - ' + selectedMod.title },
                { type: 'controle_type', url: formatDriveLink(formData.pdf_controles), title: 'Contrôle - ' + selectedMod.title },
                { type: 'annales', url: formatDriveLink(formData.pdf_examens), title: 'National - ' + selectedMod.title }
            ];

            for (const res of resourcesToCreate) {
                if (res.url && res.url.trim() !== '' && res.url.trim() !== 'https://') {
                    await fetch('/api/admin/resources', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            module_id: formData.module_id,
                            title: res.title,
                            type: res.type,
                            file_url: res.url,
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
            const res = await fetch(`/api/admin/resources/${id}`, {
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
            module_id: r.module_id,
            pdf_cours: r.file_url || '',
            pdf_exercices: '',
            pdf_controles: '',
            pdf_examens: '',
            is_premium: r.is_premium,
            is_published: r.is_published
        });
        setIsDialogOpen(true);
    };

    const openCreate = (moduleIdPreset?: string) => {
        setEditingId(null);
        setFormData({
            module_id: moduleIdPreset || (filteredModulesInSemester.length > 0 ? filteredModulesInSemester[0].id : ''),
            pdf_cours: '',
            pdf_exercices: '',
            pdf_controles: '',
            pdf_examens: '',
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

    const crumbs: { label: string; onClick?: () => void }[] = [{ label: '🏠 Fichiers', onClick: resetAll }];
    if (selectedCycle) crumbs.push({ label: selectedCycle });
    if (selectedGrade) crumbs.push({ label: GRADES[selectedCycle || '']?.find(g => g.code === selectedGrade)?.label || selectedGrade });
    if (selectedBranch) crumbs.push({ label: BRANCHES[selectedGrade || '']?.find(b => b.code === selectedBranch)?.label || selectedBranch });
    if (selectedSubject) crumbs.push({ label: selectedSubject });
    if (selectedSemester) crumbs.push({ label: SEMESTERS.find(s => s.code === selectedSemester)?.label || selectedSemester });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Fichiers & Ressources</h2>
                    <p className="text-slate-400 mt-2 font-medium">Attachez facilement vos PDFs et Vidéos à vos Modules de l'arborescence.</p>
                </div>
            </div>

            {/* Breadcrumb */}
            {step !== 'cycle' && (
                <div className="flex items-center gap-3">
                    <button onClick={goBack} className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-all group shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                    </button>
                    <div className="flex items-center gap-1.5 text-sm flex-wrap">
                        {crumbs.map((bc, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                                {bc.onClick ? (
                                    <button onClick={bc.onClick} className="font-bold text-slate-500 hover:text-indigo-400 transition-colors">{bc.label}</button>
                                ) : (
                                    <span className={`font-bold ${i === crumbs.length - 1 ? 'text-white' : 'text-slate-500'}`}>{bc.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══ STEP: Cycle ═══ */}
            {step === 'cycle' && (
                <StepCard stepNum={1} title="Choisir le Cycle">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {CYCLES.map(c => (
                            <NavCard key={c.code} onClick={() => selectCycle(c.code)}
                                emoji={c.icon} code={c.code} label={c.label}
                                count={modules.filter(m => m.tags?.includes(c.code)).length} />
                        ))}
                    </div>
                </StepCard>
            )}

            {/* ═══ STEP: Grade ═══ */}
            {step === 'grade' && selectedCycle && (
                <StepCard stepNum={2} title="Choisir le Niveau">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(GRADES[selectedCycle] || []).map(g => (
                            <NavCard key={g.code} onClick={() => selectGrade(g.code)}
                                icon={<GraduationCap className="w-6 h-6 text-indigo-400" />}
                                code={g.code} label={g.label}
                                count={modules.filter(m => m.tags?.includes(selectedCycle) && m.tags?.includes(g.code)).length} />
                        ))}
                    </div>
                </StepCard>
            )}

            {/* ═══ STEP: Branch (Filière) ═══ */}
            {step === 'branch' && selectedGrade && (
                <StepCard stepNum={3} title="Choisir la Filière">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(BRANCHES[selectedGrade] || []).map(b => (
                            <NavCard key={b.code} onClick={() => selectBranch(b.code)}
                                icon={<GitBranch className="w-6 h-6 text-amber-400" />}
                                code={b.code} label={b.label}
                                count={modules.filter(m => m.tags?.includes(selectedGrade!) && m.tags?.includes(b.code)).length} />
                        ))}
                    </div>
                </StepCard>
            )}

            {/* ═══ STEP: Subject (Matière) ═══ */}
            {step === 'subject' && (
                <StepCard stepNum={selectedBranch ? 4 : 3} title="Choisir la Matière">
                    {availableSubjects.length === 0 ? (
                        <div className="text-center py-12">
                            <Library className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Aucune matière trouvée pour cette sélection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableSubjects.map(subj => (
                                <NavCard key={subj} onClick={() => selectSubject(subj)}
                                    icon={<BookOpen className="w-6 h-6 text-emerald-400" />}
                                    label={subj}
                                    count={(() => {
                                        let m = modules;
                                        if (selectedCycle) m = m.filter(x => x.tags?.includes(selectedCycle));
                                        if (selectedGrade) m = m.filter(x => x.tags?.includes(selectedGrade));
                                        if (selectedBranch) m = m.filter(x => x.tags?.includes(selectedBranch));
                                        return m.filter(x => x.subject === subj).length;
                                    })()} />
                            ))}
                        </div>
                    )}
                </StepCard>
            )}

            {/* ═══ STEP: Semester ═══ */}
            {step === 'semester' && (
                <StepCard stepNum={selectedBranch ? 5 : 4} title="Choisir le Semestre">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                        {SEMESTERS.map(sem => {
                            let m = modules;
                            if (selectedCycle) m = m.filter(x => x.tags?.includes(selectedCycle));
                            if (selectedGrade) m = m.filter(x => x.tags?.includes(selectedGrade));
                            if (selectedBranch) m = m.filter(x => x.tags?.includes(selectedBranch));
                            if (selectedSubject) m = m.filter(x => x.subject === selectedSubject);
                            const count = m.filter(x => x.tags?.includes(sem.code)).length;
                            return (
                                <NavCard key={sem.code} onClick={() => selectSemester(sem.code)}
                                    icon={<Calendar className="w-7 h-7 text-purple-400" />}
                                    label={sem.label} count={count} large />
                            );
                        })}
                    </div>
                </StepCard>
            )}

            {/* ═══ STEP: Resources List & Creation ═══ */}
            {step === 'modules' && (
                <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <div className="p-6 border-b border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80">
                        <div className="relative w-full md:w-96 group">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une ressource..."
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-600"
                            />
                        </div>
                        <Button onClick={() => openCreate()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <Plus className="w-5 h-5 mr-2" />
                            Nouvelle Ressource
                        </Button>
                    </div>

                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Chargement des ressources...</div>
                        ) : activeResources.length === 0 ? (
                            <div className="p-12 text-center">
                                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">Aucune ressource pour ce semestre.</p>
                                <p className="text-sm mt-1 text-slate-600">Cliquez sur « Nouvelle Ressource » pour ajouter des cours ou exercices.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {activeResources.map((res) => (
                                    <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${getTypeColor(res.type)}`}>
                                                {getTypeIcon(res.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black text-lg text-white mb-2 truncate group-hover:text-indigo-300 transition-colors flex items-center gap-3">
                                                    {res.file_url ? (
                                                        <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-400 transition-colors cursor-pointer">
                                                            {res.title}
                                                        </a>
                                                    ) : (
                                                        <span>{res.title}</span>
                                                    )}
                                                    {!res.is_published && (
                                                        <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 uppercase tracking-widest px-2">Brouillon</Badge>
                                                    )}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-3 py-1 text-xs">
                                                        {getFormatLabel(res.type)}
                                                    </Badge>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.subject_name || 'Général'}</span>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="text-xs font-bold text-indigo-400 truncate max-w-[200px]">{res.module_title}</span>
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
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">{editingId ? 'Modifier la Ressource' : 'Placer des Fichiers dans un Module'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-8 mt-4">

                        {!editingId && (
                            <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-lg text-indigo-400">1. Sélectionner le Module de destination</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Liste des Modules créés</label>
                                    <select
                                        required
                                        value={formData.module_id}
                                        onChange={e => setFormData({ ...formData, module_id: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                                    >
                                        <option value="" disabled>-- Choisir un Module --</option>
                                        {filteredModulesInSemester.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                            <h3 className="font-bold text-lg text-indigo-400">{editingId ? 'URL du Document' : '2. Liens des Documents (Laissez vide si non applicable)'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Lien Google Drive (Ressource Principale)</label>
                                    <input value={formData.pdf_cours} onChange={e => setFormData({ ...formData, pdf_cours: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                </div>
                                {!editingId && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Série d'Exercices</label>
                                            <input value={formData.pdf_exercices} onChange={e => setFormData({ ...formData, pdf_exercices: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Contrôle Type</label>
                                            <input value={formData.pdf_controles} onChange={e => setFormData({ ...formData, pdf_controles: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Examen National (Corrigé)</label>
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

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Annuler</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-600/20">Sauvegarder</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ── Reusable sub-components ──

function StepCard({ stepNum, title, children }: { stepNum: number; title: string; children: React.ReactNode }) {
    return (
        <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-slate-800/60 bg-slate-900/80">
                <p className="text-[13px] font-bold text-indigo-400 uppercase tracking-widest">Étape {stepNum}</p>
                <h3 className="text-xl font-black text-white mt-1">{title}</h3>
            </div>
            <CardContent className="p-8">{children}</CardContent>
        </Card>
    );
}

function NavCard({ onClick, emoji, icon, code, label, count, large }: {
    onClick: () => void; emoji?: string; icon?: React.ReactNode; code?: string;
    label: string; count?: number; large?: boolean;
}) {
    return (
        <button onClick={onClick} className={`${large ? 'p-8 text-center' : 'p-6 text-left'} rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group`}>
            <div className={`w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center ${large ? 'mx-auto mb-4 w-14 h-14' : 'mb-4'} group-hover:scale-110 transition-transform`}>
                {emoji ? <span className="text-2xl">{emoji}</span> : icon}
            </div>
            {code && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{code}</span>}
            <h4 className={`font-bold text-white ${large ? 'text-lg' : 'text-sm'} mt-1 leading-snug group-hover:text-indigo-300 transition-colors`}>{label}</h4>
            {count !== undefined && <Badge className="mt-3 bg-slate-700 text-slate-300 border-slate-600 font-bold">{count} module{count > 1 ? 's' : ''}</Badge>}
        </button>
    );
}
