import { useState, useEffect } from 'react';
import {
    Search, Download, Star, Eye, ChevronRight, ChevronDown,
    LayoutGrid, List, FileText, ArrowLeft,
    BookOpen, PenTool, SlidersHorizontal, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Resource type labels & colors
const TYPE_MAP: Record<string, { label: string; color: string }> = {
    pdf_cours: { label: 'Cours', color: 'bg-blue-50 text-blue-600' },
    pdf_resume: { label: 'Résumé', color: 'bg-sky-50 text-sky-600' },
    exercices: { label: 'Exercices', color: 'bg-emerald-50 text-emerald-600' },
    correction: { label: 'Correction', color: 'bg-lime-50 text-lime-600' },
    quiz: { label: 'Quiz', color: 'bg-violet-50 text-violet-600' },
    controle_type: { label: 'Contrôle', color: 'bg-amber-50 text-amber-700' },
    annales: { label: 'Annales', color: 'bg-rose-50 text-rose-600' },
    methode: { label: 'Méthode', color: 'bg-pink-50 text-pink-600' },
    video_capsule: { label: 'Vidéo', color: 'bg-purple-50 text-purple-600' },
};

export default function StudentSearch() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // ── Hierarchy State ──
    const [cycles, setCycles] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);

    const [selectedCycle, setSelectedCycle] = useState<any | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<any | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<any | null>(null);

    type NavStep = 'cycle' | 'grade' | 'branch' | 'semester' | 'subject' | 'unit' | 'resources';
    const [step, setStep] = useState<NavStep>('cycle');

    // ── Fetch Effects ──
    useEffect(() => {
        fetch('/api/cycles').then(r => r.json()).then(setCycles).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedCycle?.id)
            fetch(`/api/grades?cycleId=${selectedCycle.id}`).then(r => r.json()).then(setGrades).catch(console.error);
    }, [selectedCycle]);

    useEffect(() => {
        if (selectedGrade?.id)
            fetch(`/api/branches?gradeId=${selectedGrade.id}`).then(r => r.json()).then(setBranches).catch(console.error);
    }, [selectedGrade]);

    useEffect(() => {
        if (selectedGrade?.id && selectedSemester) {
            const branchParam = selectedBranch ? `&branchId=${selectedBranch.id}` : '';
            fetch(`/api/subjects?gradeId=${selectedGrade.id}&semester=${selectedSemester}${branchParam}`)
                .then(r => r.json()).then(setSubjects).catch(console.error);
        }
    }, [selectedGrade, selectedBranch, selectedSemester]);

    useEffect(() => {
        if (selectedSubject?.course_id)
            fetch(`/api/units?courseId=${selectedSubject.course_id}`).then(r => r.json()).then(setUnits).catch(console.error);
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedUnit?.id)
            fetch(`/api/resources?unitId=${selectedUnit.id}`).then(r => r.json()).then(setResources).catch(console.error);
    }, [selectedUnit]);

    // ── Search ──
    useEffect(() => {
        if (searchQuery.length < 2) { setSearchResults([]); return; }
        setIsSearching(true);
        const timeout = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                .then(r => r.json())
                .then(data => { setSearchResults(data); setIsSearching(false); })
                .catch(() => setIsSearching(false));
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    // ── Navigation handlers ──
    const selectCycle = (c: any) => { setSelectedCycle(c); setStep('grade'); };
    const selectGrade = (g: any) => {
        setSelectedGrade(g);
        // If grade has branches (lycée), go to branch selection. Otherwise skip to semester.
        fetch(`/api/branches?gradeId=${g.id}`)
            .then(r => r.json())
            .then((b: any[]) => {
                setBranches(b);
                if (b.length > 0) setStep('branch');
                else { setSelectedBranch(null); setStep('semester'); }
            });
    };
    const selectBranch = (b: any) => { setSelectedBranch(b); setStep('semester'); };
    const selectSemester = (s: number) => { setSelectedSemester(s); setStep('subject'); };
    const selectSubject = (s: any) => { setSelectedSubject(s); setStep('unit'); };
    const selectUnit = (u: any) => { setSelectedUnit(u); setStep('resources'); };

    const goBack = () => {
        if (step === 'resources') { setSelectedUnit(null); setResources([]); setStep('unit'); }
        else if (step === 'unit') { setSelectedSubject(null); setUnits([]); setStep('subject'); }
        else if (step === 'subject') { setSelectedSemester(null); setSubjects([]); setStep('semester'); }
        else if (step === 'semester') {
            if (branches.length > 0) { setSelectedBranch(null); setStep('branch'); }
            else { setSelectedGrade(null); setStep('grade'); }
        }
        else if (step === 'branch') { setSelectedGrade(null); setBranches([]); setStep('grade'); }
        else if (step === 'grade') { setSelectedCycle(null); setGrades([]); setStep('cycle'); }
    };

    const resetAll = () => {
        setSelectedCycle(null); setSelectedGrade(null); setSelectedBranch(null);
        setSelectedSemester(null); setSelectedSubject(null); setSelectedUnit(null);
        setResources([]); setUnits([]); setSubjects([]); setBranches([]); setGrades([]);
        setStep('cycle');
    };

    // ── RESOURCE VIEW (final step) ──
    if (step === 'resources' && selectedUnit) {
        return (
            <div className="max-w-[1100px] mx-auto w-full animate-in fade-in duration-300">
                <Breadcrumb items={[
                    { label: 'Bibliothèque', onClick: resetAll },
                    { label: selectedCycle?.name },
                    { label: selectedGrade?.grade_code },
                    ...(selectedBranch ? [{ label: selectedBranch.branch_code }] : []),
                    { label: `S${selectedSemester}` },
                    { label: selectedSubject?.name },
                    { label: selectedUnit.title, active: true },
                ]} />

                <div className="flex items-center gap-4 mb-8 mt-4">
                    <button onClick={goBack} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedUnit.title}</h1>
                        {selectedUnit.title_ar && <p className="text-sm text-slate-400 font-medium mt-0.5" dir="rtl">{selectedUnit.title_ar}</p>}
                    </div>
                </div>

                {/* Quick chapter switcher */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                    {units.map(u => (
                        <button key={u.id} onClick={() => selectUnit(u)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${selectedUnit.id === u.id
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}>
                            {u.title}
                        </button>
                    ))}
                </div>

                {/* Resources */}
                <div className="flex flex-col gap-3">
                    {resources.length === 0 ? (
                        <EmptyState text="Aucune ressource pour ce chapitre." sub="Des documents seront ajoutés prochainement." />
                    ) : (
                        resources.map(r => <ResourceCard key={r.id} resource={r} />)
                    )}
                </div>
            </div>
        );
    }

    // ── MAIN SEARCH VIEW ──
    const isSearchActive = searchQuery.length >= 2;

    return (
        <div className="max-w-[1100px] mx-auto w-full">

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher un cours, exercice, examen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-14 py-4 text-[15px] font-medium text-slate-800 focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                )}
                {isSearching && <Loader2 className="w-5 h-5 text-slate-400 absolute right-14 top-1/2 -translate-y-1/2 animate-spin" />}
            </div>

            {/* Search Results */}
            {isSearchActive ? (
                <div className="animate-in fade-in duration-200">
                    <p className="text-sm font-semibold text-slate-400 mb-4">
                        {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} pour « {searchQuery} »
                    </p>
                    {searchResults.length === 0 && !isSearching ? (
                        <EmptyState text="Aucun résultat trouvé." sub="Essayez un autre terme de recherche." />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {searchResults.map(r => <ResourceCard key={r.id} resource={r} showContext />)}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Navigation Title */}
                    {step !== 'cycle' && (
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={goBack} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                                <ArrowLeft className="w-4 h-4 text-slate-500" />
                            </button>
                            <Breadcrumb items={[
                                { label: 'Bibliothèque', onClick: resetAll },
                                ...(selectedCycle ? [{ label: selectedCycle.name }] : []),
                                ...(selectedGrade ? [{ label: selectedGrade.grade_code }] : []),
                                ...(selectedBranch ? [{ label: selectedBranch.branch_code }] : []),
                                ...(selectedSemester ? [{ label: `S${selectedSemester}` }] : []),
                                ...(selectedSubject ? [{ label: selectedSubject.name }] : []),
                            ]} />
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <p className="text-sm font-bold text-slate-500 mb-4">
                            {step === 'cycle' && 'Choisir un cycle'}
                            {step === 'grade' && 'Choisir un niveau'}
                            {step === 'branch' && 'Choisir une filière'}
                            {step === 'semester' && 'Choisir un semestre'}
                            {step === 'subject' && 'Choisir une matière'}
                            {step === 'unit' && 'Choisir un chapitre'}
                        </p>

                        <div className={`grid gap-2 ${step === 'cycle' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
                            {step === 'cycle' && cycles.map(c => (
                                <NavButton key={c.id} onClick={() => selectCycle(c)}
                                    label={c.name} sublabel={c.name_ar} />
                            ))}

                            {step === 'grade' && grades.map(g => (
                                <NavButton key={g.id} onClick={() => selectGrade(g)}
                                    label={g.name} sublabel={g.name_ar} code={g.grade_code} />
                            ))}

                            {step === 'branch' && branches.map(b => (
                                <NavButton key={b.id} onClick={() => selectBranch(b)}
                                    label={b.name} sublabel={b.name_ar} code={b.branch_code} />
                            ))}

                            {step === 'semester' && [1, 2].map(s => (
                                <NavButton key={s} onClick={() => selectSemester(s)}
                                    label={`Semestre ${s}`} sublabel={s === 1 ? 'الأسدس 1' : 'الأسدس 2'} />
                            ))}

                            {step === 'subject' && subjects.map(s => (
                                <NavButton key={s.course_id} onClick={() => selectSubject(s)}
                                    label={s.name} sublabel={s.name_ar} />
                            ))}

                            {step === 'unit' && units.map(u => (
                                <NavButton key={u.id} onClick={() => selectUnit(u)}
                                    label={u.title} sublabel={u.title_ar} hasArrow />
                            ))}
                        </div>
                    </div>

                    {/* Hint */}
                    {step === 'cycle' && (
                        <div className="text-center py-12">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-semibold text-sm">Navigue ou recherche pour trouver tes documents</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ─── Sub-components ───

function NavButton({ label, sublabel, code, onClick, hasArrow }: {
    label: string; sublabel?: string; code?: string; onClick: () => void; hasArrow?: boolean;
}) {
    return (
        <button onClick={onClick}
            className="px-4 py-3 rounded-xl border border-slate-200 text-left font-semibold text-sm text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all group flex items-center justify-between gap-2">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    {code && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{code}</span>}
                    <span className="truncate">{label}</span>
                </div>
                {sublabel && <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate" dir="rtl">{sublabel}</p>}
            </div>
            {hasArrow && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
        </button>
    );
}

function Breadcrumb({ items }: { items: { label?: string; onClick?: () => void; active?: boolean }[] }) {
    return (
        <div className="flex items-center gap-1.5 text-sm flex-wrap">
            {items.filter(i => i.label).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                    {item.onClick ? (
                        <button onClick={item.onClick} className="font-semibold text-slate-400 hover:text-indigo-600 transition-colors">{item.label}</button>
                    ) : (
                        <span className={`font-semibold ${item.active ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
                    )}
                </div>
            ))}
        </div>
    );
}

function ResourceCard({ resource, showContext }: { resource: any; showContext?: boolean }) {
    const typeInfo = TYPE_MAP[resource.type] || { label: resource.type, color: 'bg-slate-100 text-slate-600' };
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-all group flex gap-4 items-start">
            <div className="w-12 h-14 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`text-[10px] uppercase font-bold tracking-wider border-none ${typeInfo.color} px-2 py-0.5`}>
                        {typeInfo.label}
                    </Badge>
                    {resource.difficulty && (
                        <span className="text-[10px] text-slate-400 font-medium">Difficulté {resource.difficulty}/5</span>
                    )}
                    {resource.file_size_kb && (
                        <span className="text-[10px] text-slate-400 font-medium">{Math.round(resource.file_size_kb / 1024 * 10) / 10} MB</span>
                    )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {resource.title}
                </h3>
                {showContext && (
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                        {resource.grade_code} {resource.branch_code && `· ${resource.branch_code}`} · {resource.subject_name} · S{resource.semester}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {resource.downloads_count || 0}</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <Eye className="w-4 h-4 text-slate-500" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <Star className="w-4 h-4 text-slate-500" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-colors">
                    <Download className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}

function EmptyState({ text, sub }: { text: string; sub: string }) {
    return (
        <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold">{text}</p>
            <p className="text-slate-400 text-sm mt-1">{sub}</p>
        </div>
    );
}
