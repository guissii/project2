import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Library, ArrowLeft, ChevronRight, BookOpen, GraduationCap, Calendar, GitBranch } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CYCLES, GRADES, BRANCHES, SEMESTERS } from '../../data/education-hierarchy';

type Module = {
    id: string;
    title: string;
    description: string | null;
    subject: string;
    tags: string[];
    order: number;
    is_published: boolean;
};


type NavStep = 'cycle' | 'grade' | 'branch' | 'subject' | 'semester' | 'modules';

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
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', order: 0, is_published: true });

    // Multi-branch selection state for the dialog
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

    // ── Derived filtered data ──
    const filtered = useMemo(() => {
        let mods = allModules;
        if (selectedCycle) mods = mods.filter(m => m.tags?.includes(selectedCycle));
        if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
        if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
        if (selectedSubject) mods = mods.filter(m => m.subject === selectedSubject);
        if (selectedSemester) mods = mods.filter(m => m.tags?.includes(selectedSemester));
        return mods;
    }, [allModules, selectedCycle, selectedGrade, selectedBranch, selectedSubject, selectedSemester]);

    const availableSubjects = useMemo(() => {
        let mods = allModules;
        if (selectedCycle) mods = mods.filter(m => m.tags?.includes(selectedCycle));
        if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
        if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
        return Array.from(new Set(mods.map(m => m.subject))).sort();
    }, [allModules, selectedCycle, selectedGrade, selectedBranch]);

    // ── Navigation ──
    const selectCycle = (c: string) => { setSelectedCycle(c); setStep('grade'); };
    const selectGrade = (g: string) => {
        setSelectedGrade(g);
        const branches = BRANCHES[g];
        if (branches && branches.length > 0) {
            setStep('branch');
        } else {
            setStep('subject');
        }
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

    // ── CRUD ──
    const openCreate = () => {
        setEditingModule(null);
        const maxOrder = filtered.length > 0 ? Math.max(...filtered.map(m => m.order)) + 1 : 1;
        setFormData({ title: '', description: '', order: maxOrder, is_published: true });
        setDialogSelectedBranches(selectedBranch ? [selectedBranch] : []);
        setIsDialogOpen(true);
    };

    const openEdit = (mod: Module) => {
        setEditingModule(mod);
        setFormData({ title: mod.title, description: mod.description || '', order: mod.order, is_published: mod.is_published });

        // Extract branches from module tags
        const availableBranchesInGrade = GRADES[selectedCycle || ''] ? BRANCHES[selectedGrade || '']?.map(b => b.code) || [] : [];
        const moduleBranches = mod.tags.filter(t => availableBranchesInGrade.includes(t));
        setDialogSelectedBranches(moduleBranches.length > 0 ? moduleBranches : (selectedBranch ? [selectedBranch] : []));

        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Base tags are cycle, grade, and semester
        const baseTags = [selectedCycle, selectedGrade, selectedSemester].filter(Boolean) as string[];

        // Combine base tags with all selected branches
        const allTags = [...baseTags, ...dialogSelectedBranches];

        try {
            if (editingModule) {
                // Determine new tags, keeping any non-branch/cycle/grade/semester tags that might exist 
                // just in case, but usually we just overwrite with the new hierarchy calculation
                await fetch(`/api/admin/modules/${editingModule.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description || null,
                        subject: selectedSubject,
                        tags: allTags,
                        order: formData.order,
                        is_published: formData.is_published
                    })
                });
            } else {
                await fetch('/api/admin/modules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description || null,
                        subject: selectedSubject,
                        tags: allTags,
                        order: formData.order,
                        is_published: formData.is_published
                    })
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

    // ── Breadcrumb data ──
    const crumbs: { label: string; onClick?: () => void }[] = [{ label: '🏠 Modules', onClick: resetAll }];
    if (selectedCycle) crumbs.push({ label: selectedCycle });
    if (selectedGrade) crumbs.push({ label: GRADES[selectedCycle || '']?.find(g => g.code === selectedGrade)?.label || selectedGrade });
    if (selectedBranch) crumbs.push({ label: BRANCHES[selectedGrade || '']?.find(b => b.code === selectedBranch)?.label || selectedBranch });
    if (selectedSubject) crumbs.push({ label: selectedSubject });
    if (selectedSemester) crumbs.push({ label: SEMESTERS.find(s => s.code === selectedSemester)?.label || selectedSemester });

    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-slate-400 font-bold animate-pulse">Chargement...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-[1600px] mx-auto pb-20">

            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Modules & Chapitres</h2>
                <p className="text-slate-400 mt-2 font-medium">Naviguez dans l'arborescence du système éducatif marocain.</p>
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
                                emoji={c.icon} code={c.code} label={c.label} labelAr={c.label_ar}
                                count={allModules.filter(m => m.tags?.includes(c.code)).length} />
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
                                code={g.code} label={g.label} labelAr={g.label_ar}
                                count={allModules.filter(m => m.tags?.includes(selectedCycle) && m.tags?.includes(g.code)).length} />
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
                                code={b.code} label={b.label} labelAr={b.label_ar}
                                count={allModules.filter(m => m.tags?.includes(selectedGrade!) && m.tags?.includes(b.code)).length} />
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
                                        let m = allModules;
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
                            let mods = allModules;
                            if (selectedCycle) mods = mods.filter(m => m.tags?.includes(selectedCycle));
                            if (selectedGrade) mods = mods.filter(m => m.tags?.includes(selectedGrade));
                            if (selectedBranch) mods = mods.filter(m => m.tags?.includes(selectedBranch));
                            if (selectedSubject) mods = mods.filter(m => m.subject === selectedSubject);
                            const count = mods.filter(m => m.tags?.includes(sem.code)).length;
                            return (
                                <NavCard key={sem.code} onClick={() => selectSemester(sem.code)}
                                    icon={<Calendar className="w-7 h-7 text-purple-400" />}
                                    label={sem.label} labelAr={sem.label_ar} count={count} large />
                            );
                        })}
                    </div>
                </StepCard>
            )}

            {/* ═══ STEP: Modules CRUD List ═══ */}
            {step === 'modules' && (
                <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80">
                        <div>
                            <p className="text-[13px] font-bold text-indigo-400 uppercase tracking-widest">Chapitres</p>
                            <h3 className="text-xl font-black text-white mt-1">{selectedSubject} — {SEMESTERS.find(s => s.code === selectedSemester)?.label}</h3>
                        </div>
                        <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                            <Plus className="w-5 h-5 mr-2" /> Ajouter un Chapitre
                        </Button>
                    </div>
                    <CardContent className="p-0">
                        {filtered.length === 0 ? (
                            <div className="p-12 text-center">
                                <Library className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold">Aucun chapitre pour cette sélection.</p>
                                <p className="text-slate-500 text-sm mt-1">Cliquez sur "Ajouter un Chapitre" pour commencer.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {filtered.sort((a, b) => a.order - b.order).map(mod => (
                                    <div key={mod.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center font-black text-indigo-400 text-lg shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                                                {mod.order}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-white text-[15px] truncate group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                                                    {mod.title}
                                                    {!mod.is_published && <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 uppercase tracking-widest px-2">Brouillon</Badge>}
                                                </h4>
                                                {mod.description && <p className="text-xs text-slate-500 font-medium mt-1 truncate">{mod.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button onClick={() => openEdit(mod)} variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl"><Edit2 className="w-5 h-5" /></Button>
                                            <Button onClick={() => handleDelete(mod.id)} variant="ghost" size="icon" className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-5 h-5" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ═══ Dialog: Create / Edit ═══ */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">{editingModule ? 'Modifier le Chapitre' : 'Ajouter un Chapitre'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Titre *</label>
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="Ex: Limites et continuité" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Description (optionnel)</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 resize-none h-20" placeholder="Description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Ordre</label>
                                <input type="number" min={1} value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-700 text-indigo-500 bg-slate-900" />
                                    <span className="font-bold text-slate-300 text-sm">Publié</span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contexte & Affectation Multiple</p>

                            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-800/60">
                                {selectedCycle && <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">{selectedCycle}</Badge>}
                                {selectedGrade && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">{selectedGrade}</Badge>}
                                {selectedSubject && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{selectedSubject}</Badge>}
                                {selectedSemester && <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">{SEMESTERS.find(s => s.code === selectedSemester)?.label}</Badge>}
                            </div>

                            {selectedGrade && BRANCHES[selectedGrade] && BRANCHES[selectedGrade].length > 0 ? (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-2">Assigner à d'autres filières de {selectedGrade} :</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {BRANCHES[selectedGrade].map(b => (
                                            <label key={b.code} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800">
                                                <input
                                                    type="checkbox"
                                                    checked={dialogSelectedBranches.includes(b.code)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setDialogSelectedBranches(prev => [...prev, b.code]);
                                                        } else {
                                                            // Require at least one branch if branches exist for this grade
                                                            if (dialogSelectedBranches.length > 1) {
                                                                setDialogSelectedBranches(prev => prev.filter(c => c !== b.code));
                                                            }
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-900"
                                                />
                                                <span className="font-medium text-slate-300 text-sm">{b.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {dialogSelectedBranches.length === 0 && (
                                        <p className="text-xs text-rose-400 mt-2 font-medium">⚠️ Veuillez sélectionner au moins une filière.</p>
                                    )}
                                </div>
                            ) : null}
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">Annuler</Button>
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

function NavCard({ onClick, emoji, icon, code, label, labelAr, count, large }: {
    onClick: () => void; emoji?: string; icon?: React.ReactNode; code?: string;
    label: string; labelAr?: string; count?: number; large?: boolean;
}) {
    return (
        <button onClick={onClick} className={`${large ? 'p-8 text-center' : 'p-6 text-left'} rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group`}>
            <div className={`w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center ${large ? 'mx-auto mb-4 w-14 h-14' : 'mb-4'} group-hover:scale-110 transition-transform`}>
                {emoji ? <span className="text-2xl">{emoji}</span> : icon}
            </div>
            {code && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{code}</span>}
            <h4 className={`font-bold text-white ${large ? 'text-lg' : 'text-sm'} mt-1 leading-snug group-hover:text-indigo-300 transition-colors`}>{label}</h4>
            {labelAr && <p className="text-xs text-slate-500 font-medium mt-1" dir="rtl">{labelAr}</p>}
            {count !== undefined && <Badge className="mt-3 bg-slate-700 text-slate-300 border-slate-600 font-bold">{count} chapitre{count > 1 ? 's' : ''}</Badge>}
        </button>
    );
}
