import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Plus, Edit2, Trash2, Library, ArrowLeft, ChevronRight, ChevronDown,
    BookOpen, GraduationCap, FolderOpen, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CYCLES, GRADES, BRANCHES, SEMESTERS, SUBJECTS } from '../../data/education-hierarchy';

type Module = {
    id: string;
    title: string;
    description: string | null;
    subject: string;
    tags: string[];
    order: number;
    is_published: boolean;
};

type NavStep = 'cycle' | 'tree' | 'modules';

export default function ModulesView() {
    const { token } = useAuth();
    const [allModules, setAllModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Navigation state
    const [step, setStep] = useState<NavStep>('cycle');
    const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [activeSemester, setActiveSemester] = useState(1);
    const [expandedGradeCode, setExpandedGradeCode] = useState<string | null>(null);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', order: 0, is_published: true });
    const [dialogSelectedBranches, setDialogSelectedBranches] = useState<string[]>([]);

    useEffect(() => { if (token) fetchModules(); }, [token]);

    const fetchModules = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/modules', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setAllModules(await res.json());
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

    // ── Navigation ──
    const selectCycle = (c: string) => { setSelectedCycle(c); setStep('tree'); };

    const selectFromTree = (gradeCode: string, branchCode?: string) => {
        setSelectedGrade(gradeCode);
        setSelectedBranch(branchCode || null);
        setSelectedSubject(null);
        setActiveSemester(1);
        setStep('modules');
    };

    const goBack = () => {
        if (step === 'modules') {
            setSelectedGrade(null); setSelectedBranch(null);
            setSelectedSubject(null); setStep('tree');
        } else if (step === 'tree') {
            setSelectedCycle(null); setExpandedGradeCode(null); setStep('cycle');
        }
    };

    const resetAll = () => {
        setSelectedCycle(null); setSelectedGrade(null); setSelectedBranch(null);
        setSelectedSubject(null); setExpandedGradeCode(null);
        setStep('cycle'); setActiveSemester(1);
    };

    // ── CRUD ──
    const openCreate = () => {
        setEditingModule(null);
        const maxOrder = filteredModules.length > 0 ? Math.max(...filteredModules.map(m => m.order)) + 1 : 1;
        setFormData({ title: '', description: '', order: maxOrder, is_published: true });
        setDialogSelectedBranches(selectedBranch ? [selectedBranch] : []);
        setIsDialogOpen(true);
    };

    const openEdit = (mod: Module) => {
        setEditingModule(mod);
        setFormData({ title: mod.title, description: mod.description || '', order: mod.order, is_published: mod.is_published });
        const availableBranchCodes = selectedGrade ? (BRANCHES[selectedGrade] || []).map(b => b.code) : [];
        const moduleBranches = mod.tags.filter(t => availableBranchCodes.includes(t));
        setDialogSelectedBranches(moduleBranches.length > 0 ? moduleBranches : (selectedBranch ? [selectedBranch] : []));
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const semesterCode = `S${activeSemester}`;
        const baseTags = [selectedCycle, selectedGrade, semesterCode].filter(Boolean) as string[];
        const allTags = [...baseTags, ...dialogSelectedBranches];

        const body = {
            title: formData.title,
            description: formData.description || null,
            subject: selectedSubject,
            tags: allTags,
            order: formData.order,
            is_published: formData.is_published
        };

        try {
            if (editingModule) {
                await fetch(`/api/admin/modules/${editingModule.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body)
                });
            } else {
                await fetch('/api/admin/modules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body)
                });
            }
            setIsDialogOpen(false);
            fetchModules();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce chapitre et toutes ses ressources ?')) return;
        await fetch(`/api/admin/modules/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchModules();
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
                <p className="text-slate-400 mt-1 text-sm font-medium">Gestion de l'arborescence éducative.</p>
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

            {/* ═══ STEP: Tree View (Grades & Branches) ═══ */}
            {step === 'tree' && selectedCycle && (
                <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Niveaux & Filières — {currentCycleLabel}</p>
                    {currentGrades.map(g => {
                        const branches = BRANCHES[g.code] || [];
                        const isExpanded = expandedGradeCode === g.code;
                        const gradeModuleCount = allModules.filter(m => m.tags?.includes(g.code)).length;

                        return (
                            <div key={g.code} className="rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        if (branches.length === 0) {
                                            selectFromTree(g.code);
                                        } else {
                                            setExpandedGradeCode(isExpanded ? null : g.code);
                                        }
                                    }}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FolderOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                                        <div>
                                            <span className="font-bold text-white text-sm">{g.label}</span>
                                            <span className="text-xs text-slate-500 ml-2">({g.label_ar})</span>
                                        </div>
                                        <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-[10px]">{gradeModuleCount}</Badge>
                                    </div>
                                    {branches.length > 0 && (
                                        isExpanded
                                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                                            : <ChevronRight className="w-4 h-4 text-slate-400" />
                                    )}
                                </button>

                                {/* Branches */}
                                {isExpanded && branches.length > 0 && (
                                    <div className="border-t border-slate-700/50 bg-slate-900/50">
                                        {branches.map(b => {
                                            const branchCount = allModules.filter(m => m.tags?.includes(g.code) && m.tags?.includes(b.code)).length;
                                            return (
                                                <button
                                                    key={b.code}
                                                    onClick={() => selectFromTree(g.code, b.code)}
                                                    className="w-full flex items-center justify-between px-5 py-3 pl-12 text-left hover:bg-indigo-600/10 border-b border-slate-800/40 last:border-b-0 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                                                        <span className="font-medium text-slate-300 text-sm">{b.label}</span>
                                                        <span className="text-xs text-slate-600">({b.code})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-slate-700/50 text-slate-400 border-slate-600/50 text-[10px]">{branchCount}</Badge>
                                                        <ChevronRight className="w-3 h-3 text-slate-600" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ═══ STEP: Modules — Subjects + Semester + CRUD ═══ */}
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
                                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/30 hover:bg-slate-700'
                                            }`}>
                                        <BookOpen className="w-4 h-4" />
                                        {subj}
                                        {count > 0 && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedSubject === subj ? 'bg-white/20' : 'bg-slate-700'}`}>
                                                {count}
                                            </span>
                                        )}
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
                                    <button key={s} onClick={() => setActiveSemester(s)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeSemester === s
                                            ? 'bg-slate-700 text-white'
                                            : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-slate-300'
                                            }`}>
                                        <Calendar className="w-4 h-4" />
                                        Semestre {s}
                                    </button>
                                ))}
                            </div>

                            {/* Module List + Add Button */}
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Chapitres</p>
                                        <h3 className="text-base font-bold text-white mt-0.5">
                                            {selectedSubject} — Semestre {activeSemester}
                                        </h3>
                                    </div>
                                    <Button onClick={openCreate} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                                        <Plus className="w-4 h-4 mr-1.5" /> Ajouter
                                    </Button>
                                </div>

                                {filteredModules.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Library className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-400 font-bold text-sm">Aucun chapitre pour cette sélection.</p>
                                        <p className="text-slate-500 text-xs mt-1">Cliquez sur "Ajouter" pour commencer.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {filteredModules.map((mod, idx) => (
                                            <div key={mod.id}
                                                className={`flex items-center gap-4 px-5 py-3.5 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-800/50 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-800/20'}`}>
                                                <span className="text-sm font-bold text-slate-500 w-7 text-right shrink-0">{mod.order}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white text-sm truncate flex items-center gap-2">
                                                        {mod.title}
                                                        {!mod.is_published && (
                                                            <Badge variant="outline" className="text-[9px] bg-slate-800 text-slate-400 border-slate-700 uppercase px-1.5">Brouillon</Badge>
                                                        )}
                                                    </h4>
                                                    {mod.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{mod.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button onClick={() => openEdit(mod)} variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button onClick={() => handleDelete(mod.id)} variant="ghost" size="icon" className="w-8 h-8 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!selectedSubject && (
                        <div className="p-8 text-center text-slate-400">
                            <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                            <p className="font-bold text-sm">Sélectionnez une matière ci-dessus pour gérer ses chapitres.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ Dialog: Create / Edit ═══ */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black">{editingModule ? 'Modifier le Chapitre' : 'Ajouter un Chapitre'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-5 mt-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Titre *</label>
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500" placeholder="Ex: Limites et continuité" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400">Description (optionnel)</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 resize-none h-16" placeholder="Description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400">Ordre</label>
                                <input type="number" min={1} value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500" />
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-700 text-indigo-500 bg-slate-900" />
                                    <span className="font-bold text-slate-300 text-sm">Publié</span>
                                </label>
                            </div>
                        </div>

                        {/* Context badges */}
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contexte</p>
                            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-slate-800/60">
                                {selectedCycle && <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">{currentCycleLabel}</Badge>}
                                {selectedGrade && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">{currentGradeLabel}</Badge>}
                                {selectedSubject && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{selectedSubject}</Badge>}
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Semestre {activeSemester}</Badge>
                            </div>

                            {selectedGrade && BRANCHES[selectedGrade] && BRANCHES[selectedGrade].length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-2">Assigner aux filières :</p>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {BRANCHES[selectedGrade].map(b => (
                                            <label key={b.code} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={dialogSelectedBranches.includes(b.code)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setDialogSelectedBranches(prev => [...prev, b.code]);
                                                        } else if (dialogSelectedBranches.length > 1) {
                                                            setDialogSelectedBranches(prev => prev.filter(c => c !== b.code));
                                                        }
                                                    }}
                                                    className="w-3.5 h-3.5 rounded border-slate-700 text-indigo-500 bg-slate-900"
                                                />
                                                <span className="font-medium text-slate-300">{b.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">Annuler</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-600/20">Sauvegarder</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
