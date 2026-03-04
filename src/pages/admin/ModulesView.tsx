import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Plus, Edit2, Trash2, Library, ArrowLeft, ChevronRight, ChevronDown,
    BookOpen, GraduationCap, FolderOpen, Calendar, FileText,
    Upload, X, ExternalLink, Paperclip
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CYCLES, GRADES, BRANCHES, SUBJECTS } from '../../data/education-hierarchy';

type Module = {
    id: string;
    title: string;
    description: string | null;
    subject: string;
    tags: string[];
    order: number;
    is_published: boolean;
};

type Resource = {
    id: string;
    module_id: string;
    title: string;
    type: string;
    file_url?: string;
    is_premium: boolean;
    is_published: boolean;
};

type NavStep = 'cycle' | 'tree' | 'modules';

const RESOURCE_TYPES = [
    { code: 'pdf_cours', label: 'Cours PDF', icon: '📄', color: 'text-indigo-400' },
    { code: 'pdf_resume', label: 'Résumé PDF', icon: '📋', color: 'text-cyan-400' },
    { code: 'exercices', label: 'Exercices', icon: '✏️', color: 'text-emerald-400' },
    { code: 'correction', label: 'Correction', icon: '✅', color: 'text-green-400' },
    { code: 'controle_type', label: 'Contrôle Type', icon: '📝', color: 'text-amber-400' },
    { code: 'annales', label: 'Examen National', icon: '🎓', color: 'text-rose-400' },
    { code: 'video_capsule', label: 'Vidéo', icon: '🎥', color: 'text-purple-400' },
];

export default function ModulesView() {
    const { token } = useAuth();
    const [allModules, setAllModules] = useState<Module[]>([]);
    const [allResources, setAllResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Navigation state
    const [step, setStep] = useState<NavStep>('cycle');
    const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [activeSemester, setActiveSemester] = useState(1);
    const [expandedGradeCode, setExpandedGradeCode] = useState<string | null>(null);
    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

    // Module dialog state
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [moduleForm, setModuleForm] = useState({ title: '', description: '', order: 0, is_published: true });
    const [dialogSelectedBranches, setDialogSelectedBranches] = useState<string[]>([]);

    // Resource dialog state
    const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
    const [resourceTargetModuleId, setResourceTargetModuleId] = useState<string | null>(null);
    const [resourceForm, setResourceForm] = useState({
        title: '', type: 'pdf_cours', file_url: '', is_premium: false, is_published: true
    });

    useEffect(() => { if (token) fetchAll(); }, [token]);

    const fetchAll = async () => {
        setIsLoading(true);
        try {
            const [modRes, resRes] = await Promise.all([
                fetch('/api/admin/modules', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/admin/resources', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (modRes.ok) setAllModules(await modRes.json());
            if (resRes.ok) setAllResources(await resRes.json());
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    // ── Derived data ──
    const currentGrades = selectedCycle ? (GRADES[selectedCycle] || []) : [];
    const currentGradeLabel = currentGrades.find(g => g.code === selectedGrade)?.label || selectedGrade || '';
    const currentBranchLabel = selectedGrade ? (BRANCHES[selectedGrade] || []).find(b => b.code === selectedBranch)?.label || '' : '';
    const currentCycleLabel = CYCLES.find(c => c.code === selectedCycle)?.label || selectedCycle || '';

    const hardcodedSubjects = useMemo(() => {
        if (!selectedGrade) return [];
        const key = selectedBranch ? `${selectedGrade}_${selectedBranch}` : selectedGrade;
        return SUBJECTS[key] || [];
    }, [selectedGrade, selectedBranch]);

    const filteredModules = useMemo(() => {
        let mods = allModules;
        if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
        if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
        if (selectedSubject) mods = mods.filter(m => m.subject === selectedSubject);
        mods = mods.filter(m => m.tags?.includes(`S${activeSemester}`));
        return mods.sort((a, b) => a.order - b.order);
    }, [allModules, selectedGrade, selectedBranch, selectedSubject, activeSemester]);

    const getModuleResources = (moduleId: string) => {
        return allResources.filter(r => r.module_id === moduleId);
    };

    // ── Navigation ──
    const selectCycle = (c: string) => { setSelectedCycle(c); setStep('tree'); };
    const selectFromTree = (gradeCode: string, branchCode?: string) => {
        setSelectedGrade(gradeCode);
        setSelectedBranch(branchCode || null);
        setSelectedSubject(null);
        setActiveSemester(1);
        setExpandedModuleId(null);
        setStep('modules');
    };
    const goBack = () => {
        if (step === 'modules') {
            setSelectedGrade(null); setSelectedBranch(null);
            setSelectedSubject(null); setExpandedModuleId(null); setStep('tree');
        } else if (step === 'tree') {
            setSelectedCycle(null); setExpandedGradeCode(null); setStep('cycle');
        }
    };
    const resetAll = () => {
        setSelectedCycle(null); setSelectedGrade(null); setSelectedBranch(null);
        setSelectedSubject(null); setExpandedGradeCode(null); setExpandedModuleId(null);
        setStep('cycle'); setActiveSemester(1);
    };

    // ── Module CRUD ──
    const openCreateModule = () => {
        setEditingModule(null);
        const maxOrder = filteredModules.length > 0 ? Math.max(...filteredModules.map(m => m.order)) + 1 : 1;
        setModuleForm({ title: '', description: '', order: maxOrder, is_published: true });
        setDialogSelectedBranches(selectedBranch ? [selectedBranch] : []);
        setIsModuleDialogOpen(true);
    };

    const openEditModule = (mod: Module) => {
        setEditingModule(mod);
        setModuleForm({ title: mod.title, description: mod.description || '', order: mod.order, is_published: mod.is_published });
        const availBranches = selectedGrade ? (BRANCHES[selectedGrade] || []).map(b => b.code) : [];
        const modBranches = mod.tags.filter(t => availBranches.includes(t));
        setDialogSelectedBranches(modBranches.length > 0 ? modBranches : (selectedBranch ? [selectedBranch] : []));
        setIsModuleDialogOpen(true);
    };

    const handleSaveModule = async (e: React.FormEvent) => {
        e.preventDefault();
        const semesterCode = `S${activeSemester}`;
        const baseTags = [selectedCycle, selectedGrade, semesterCode].filter(Boolean) as string[];
        const allTags = [...baseTags, ...dialogSelectedBranches];

        const body = {
            title: moduleForm.title, description: moduleForm.description || null,
            subject: selectedSubject, tags: allTags,
            order: moduleForm.order, is_published: moduleForm.is_published
        };

        try {
            if (editingModule) {
                await fetch(`/api/admin/modules/${editingModule.id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body)
                });
            } else {
                await fetch('/api/admin/modules', {
                    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body)
                });
            }
            setIsModuleDialogOpen(false);
            fetchAll();
        } catch (err) { console.error(err); }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Supprimer ce chapitre et toutes ses ressources ?')) return;
        await fetch(`/api/admin/modules/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchAll();
    };

    // ── Resource CRUD ──
    const openCreateResource = (moduleId: string) => {
        setResourceTargetModuleId(moduleId);
        const mod = allModules.find(m => m.id === moduleId);
        setResourceForm({
            title: '', type: 'pdf_cours', file_url: '',
            is_premium: false, is_published: true
        });
        setIsResourceDialogOpen(true);
    };

    const handleSaveResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resourceTargetModuleId) return;

        const modTitle = allModules.find(m => m.id === resourceTargetModuleId)?.title || '';
        const autoTitle = resourceForm.title || `${RESOURCE_TYPES.find(t => t.code === resourceForm.type)?.label || resourceForm.type} - ${modTitle}`;

        try {
            await fetch('/api/admin/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    module_id: resourceTargetModuleId,
                    title: autoTitle,
                    type: resourceForm.type,
                    file_url: resourceForm.file_url,
                    is_premium: resourceForm.is_premium,
                    is_published: resourceForm.is_published
                })
            });
            setIsResourceDialogOpen(false);
            fetchAll();
        } catch (err) { console.error(err); }
    };

    const handleDeleteResource = async (id: string) => {
        if (!confirm('Supprimer cette ressource ?')) return;
        await fetch(`/api/admin/resources/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchAll();
    };

    // ── Breadcrumbs ──
    const crumbs: { label: string; onClick?: () => void }[] = [{ label: '🏠 Modules', onClick: resetAll }];
    if (selectedCycle) crumbs.push({ label: currentCycleLabel });
    if (selectedGrade) crumbs.push({ label: currentGradeLabel });
    if (currentBranchLabel) crumbs.push({ label: currentBranchLabel });
    if (selectedSubject) crumbs.push({ label: selectedSubject });

    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-slate-400 font-bold animate-pulse">Chargement...</div>;
    }

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-20">
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Modules & Chapitres</h2>
                <p className="text-slate-400 mt-1 text-sm font-medium">Gérez les chapitres et leurs ressources (cours, exercices, vidéos).</p>
            </div>

            {/* Breadcrumb */}
            {step !== 'cycle' && (
                <div className="flex items-center gap-3">
                    <button onClick={goBack} className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 shrink-0">
                        <ArrowLeft className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-1.5 text-sm flex-wrap">
                        {crumbs.map((bc, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                                {bc.onClick ? (
                                    <button onClick={bc.onClick} className="font-bold text-slate-500 hover:text-indigo-400">{bc.label}</button>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {CYCLES.map(c => (
                        <button key={c.code} onClick={() => selectCycle(c.code)}
                            className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all text-left group">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">{c.icon}</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{c.code}</span>
                            <h4 className="font-bold text-white text-sm mt-1 group-hover:text-indigo-300">{c.label}</h4>
                            <p className="text-xs text-slate-500 mt-0.5" dir="rtl">{c.label_ar}</p>
                            <Badge className="mt-3 bg-slate-700 text-slate-300 border-slate-600 font-bold">
                                {allModules.filter(m => m.tags?.includes(c.code)).length} chapitre(s)
                            </Badge>
                        </button>
                    ))}
                </div>
            )}

            {/* ═══ STEP: Tree View ═══ */}
            {step === 'tree' && selectedCycle && (
                <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Niveaux & Filières — {currentCycleLabel}</p>
                    {currentGrades.map(g => {
                        const branches = BRANCHES[g.code] || [];
                        const isExpanded = expandedGradeCode === g.code;
                        const gradeCount = allModules.filter(m => m.tags?.includes(g.code)).length;

                        return (
                            <div key={g.code} className="rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        if (branches.length === 0) selectFromTree(g.code);
                                        else setExpandedGradeCode(isExpanded ? null : g.code);
                                    }}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FolderOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                                        <span className="font-bold text-white text-sm">{g.label}</span>
                                        <span className="text-xs text-slate-500">({g.label_ar})</span>
                                        <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-[10px]">{gradeCount}</Badge>
                                    </div>
                                    {branches.length > 0 && (isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />)}
                                </button>
                                {isExpanded && branches.length > 0 && (
                                    <div className="border-t border-slate-700/50 bg-slate-900/50">
                                        {branches.map(b => (
                                            <button key={b.code} onClick={() => selectFromTree(g.code, b.code)}
                                                className="w-full flex items-center justify-between px-5 py-3 pl-12 text-left hover:bg-indigo-600/10 border-b border-slate-800/40 last:border-b-0 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                                                    <span className="font-medium text-slate-300 text-sm">{b.label}</span>
                                                    <span className="text-xs text-slate-600">({b.code})</span>
                                                </div>
                                                <ChevronRight className="w-3 h-3 text-slate-600" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ═══ STEP: Modules + Resources ═══ */}
            {step === 'modules' && (
                <div className="space-y-6">
                    {/* Subject Tabs */}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Matières</p>
                        <div className="flex flex-wrap gap-2">
                            {hardcodedSubjects.map(subj => {
                                const count = allModules.filter(m =>
                                    m.tags?.includes(selectedGrade!) &&
                                    (!selectedBranch || m.tags?.includes(selectedBranch)) &&
                                    m.subject === subj
                                ).length;
                                return (
                                    <button key={subj} onClick={() => setSelectedSubject(selectedSubject === subj ? null : subj)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${selectedSubject === subj
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/30'
                                            }`}>
                                        <BookOpen className="w-4 h-4" />
                                        {subj}
                                        {count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedSubject === subj ? 'bg-white/20' : 'bg-slate-700'}`}>{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedSubject && (
                        <>
                            {/* Semester Tabs */}
                            <div className="flex gap-2">
                                {[1, 2].map(s => (
                                    <button key={s} onClick={() => { setActiveSemester(s); setExpandedModuleId(null); }}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeSemester === s
                                            ? 'bg-slate-700 text-white' : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-slate-300'}`}>
                                        <Calendar className="w-4 h-4" />
                                        Semestre {s}
                                    </button>
                                ))}
                            </div>

                            {/* Chapter List with Resources */}
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Chapitres & Ressources</p>
                                        <h3 className="text-base font-bold text-white mt-0.5">{selectedSubject} — Semestre {activeSemester}</h3>
                                    </div>
                                    <Button onClick={openCreateModule} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                                        <Plus className="w-4 h-4 mr-1.5" /> Chapitre
                                    </Button>
                                </div>

                                {filteredModules.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Library className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-400 font-bold text-sm">Aucun chapitre.</p>
                                        <p className="text-slate-500 text-xs mt-1">Cliquez sur "Chapitre" pour en créer un.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {filteredModules.map((mod, idx) => {
                                            const modResources = getModuleResources(mod.id);
                                            const isExpanded = expandedModuleId === mod.id;

                                            return (
                                                <div key={mod.id} className="border-b border-slate-700/30 last:border-b-0">
                                                    {/* Module Row */}
                                                    <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/50 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-800/20'}`}>
                                                        <span className="text-sm font-bold text-slate-500 w-7 text-right shrink-0">{mod.order}</span>

                                                        <button onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)} className="flex-1 text-left min-w-0 flex items-center gap-2">
                                                            {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                                                            <h4 className="font-bold text-white text-sm truncate">{mod.title}</h4>
                                                            {!mod.is_published && <Badge variant="outline" className="text-[9px] bg-slate-800 text-slate-400 border-slate-700 uppercase px-1.5">Brouillon</Badge>}
                                                            <Badge className="bg-slate-700/50 text-slate-400 border-slate-600/50 text-[10px] ml-auto shrink-0">
                                                                {modResources.length} fichier{modResources.length !== 1 ? 's' : ''}
                                                            </Badge>
                                                        </button>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Button onClick={() => openCreateResource(mod.id)} variant="ghost" size="icon" className="w-8 h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg" title="Ajouter ressource">
                                                                <Paperclip className="w-4 h-4" />
                                                            </Button>
                                                            <Button onClick={() => openEditModule(mod)} variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button onClick={() => handleDeleteModule(mod.id)} variant="ghost" size="icon" className="w-8 h-8 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Resources List */}
                                                    {isExpanded && (
                                                        <div className="bg-slate-900/60 border-t border-slate-700/30 pl-14 pr-5 py-3">
                                                            {modResources.length === 0 ? (
                                                                <div className="flex items-center gap-3 py-3">
                                                                    <FileText className="w-4 h-4 text-slate-600" />
                                                                    <span className="text-sm text-slate-500">Aucune ressource. </span>
                                                                    <button onClick={() => openCreateResource(mod.id)} className="text-sm text-indigo-400 hover:text-indigo-300 font-bold">
                                                                        + Ajouter
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1.5">
                                                                    {modResources.map(res => {
                                                                        const typeInfo = RESOURCE_TYPES.find(t => t.code === res.type);
                                                                        return (
                                                                            <div key={res.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800/50 group">
                                                                                <span className="text-base shrink-0">{typeInfo?.icon || '📄'}</span>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm text-slate-300 font-medium truncate">{res.title}</p>
                                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                                        <span className={`text-[10px] font-bold uppercase ${typeInfo?.color || 'text-slate-500'}`}>{typeInfo?.label || res.type}</span>
                                                                                        {res.is_premium && <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded font-bold">PREMIUM</span>}
                                                                                        {!res.is_published && <span className="text-[9px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded font-bold">BROUILLON</span>}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                                    {res.file_url && (
                                                                                        <a href={res.file_url} target="_blank" rel="noopener noreferrer"
                                                                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                                                        </a>
                                                                                    )}
                                                                                    <button onClick={() => handleDeleteResource(res.id)}
                                                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10">
                                                                                        <X className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <button onClick={() => openCreateResource(mod.id)}
                                                                        className="flex items-center gap-2 py-2 px-3 text-sm text-indigo-400 hover:text-indigo-300 font-bold rounded-lg hover:bg-indigo-500/5 w-full">
                                                                        <Plus className="w-4 h-4" /> Ajouter une ressource
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!selectedSubject && (
                        <div className="p-8 text-center text-slate-400">
                            <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                            <p className="font-bold text-sm">Sélectionnez une matière ci-dessus.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ Dialog: Module Create/Edit ═══ */}
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black">{editingModule ? 'Modifier le Chapitre' : 'Ajouter un Chapitre'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveModule} className="space-y-5 mt-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Titre *</label>
                            <input required value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500" placeholder="Ex: Limites et continuité" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Description (optionnel)</label>
                            <textarea value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 resize-none h-16" placeholder="Description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400">Ordre</label>
                                <input type="number" min={1} value={moduleForm.order} onChange={e => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500" />
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={moduleForm.is_published} onChange={e => setModuleForm({ ...moduleForm, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-700 text-indigo-500 bg-slate-900" />
                                    <span className="font-bold text-slate-300 text-sm">Publié</span>
                                </label>
                            </div>
                        </div>
                        {selectedGrade && BRANCHES[selectedGrade] && BRANCHES[selectedGrade].length > 0 && (
                            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                                <p className="text-xs font-bold text-slate-400 mb-2">Filières :</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {BRANCHES[selectedGrade].map(b => (
                                        <label key={b.code} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900 text-sm">
                                            <input type="checkbox" checked={dialogSelectedBranches.includes(b.code)}
                                                onChange={e => {
                                                    if (e.target.checked) setDialogSelectedBranches(prev => [...prev, b.code]);
                                                    else if (dialogSelectedBranches.length > 1) setDialogSelectedBranches(prev => prev.filter(c => c !== b.code));
                                                }}
                                                className="w-3.5 h-3.5 rounded border-slate-700 text-indigo-500 bg-slate-900" />
                                            <span className="font-medium text-slate-300">{b.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">Annuler</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6">Sauvegarder</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ═══ Dialog: Resource Create ═══ */}
            <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black flex items-center gap-2">
                            <Paperclip className="w-5 h-5 text-emerald-400" />
                            Ajouter une Ressource
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveResource} className="space-y-5 mt-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Type de ressource *</label>
                            <div className="grid grid-cols-2 gap-2">
                                {RESOURCE_TYPES.map(t => (
                                    <button key={t.code} type="button"
                                        onClick={() => setResourceForm({ ...resourceForm, type: t.code })}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${resourceForm.type === t.code
                                            ? 'bg-indigo-600 text-white border border-indigo-500'
                                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/30'
                                            }`}>
                                        <span>{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Titre (auto-généré si vide)</label>
                            <input value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500"
                                placeholder="Ex: Cours 1 - Limites" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Lien du fichier (Google Drive, URL PDF...) *</label>
                            <input required value={resourceForm.file_url} onChange={e => setResourceForm({ ...resourceForm, file_url: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500"
                                placeholder="https://drive.google.com/file/d/..." />
                        </div>
                        <div className="flex items-center gap-6 p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" checked={resourceForm.is_premium} onChange={e => setResourceForm({ ...resourceForm, is_premium: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-900" />
                                <span className="font-bold text-slate-300">Premium</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" checked={resourceForm.is_published} onChange={e => setResourceForm({ ...resourceForm, is_published: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 text-indigo-500 bg-slate-900" />
                                <span className="font-bold text-slate-300">Publié</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setIsResourceDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">Annuler</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                                <Upload className="w-4 h-4 mr-1.5" /> Ajouter
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
