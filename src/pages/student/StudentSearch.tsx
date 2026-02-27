import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Download, Star, Eye, ChevronRight, ChevronDown,
    LayoutGrid, List, FileText, ArrowLeft,
    BookOpen, PenTool, SlidersHorizontal, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';


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
                    <button onClick={goBack} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300 shrink-0 group">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
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
                    className="w-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pl-14 pr-14 py-4 md:py-5 text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-400"
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
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={goBack} className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group">
                                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
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
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-5 md:p-8">
                        <p className="text-[13px] font-bold text-indigo-400 uppercase tracking-widest mb-6">
                            {step === 'cycle' && 'Choisir un cycle'}
                            {step === 'grade' && 'Choisir un niveau'}
                            {step === 'branch' && 'Choisir une filière'}
                            {step === 'semester' && 'Choisir un semestre'}
                            {step === 'subject' && 'Choisir une matière'}
                            {step === 'unit' && 'Choisir un chapitre'}
                        </p>

                        <div className={`grid gap-3 ${step === 'cycle' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
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
                        <div className="text-center py-16 animate-in fade-in duration-500 delay-150">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
                                <Search className="w-6 h-6 text-indigo-400" />
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
            className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm text-left font-bold text-[15px] text-slate-700 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="min-w-0 relative z-10">
                <div className="flex items-center gap-2.5">
                    {code && <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg tracking-wide">{code}</span>}
                    <span className="truncate group-hover:text-indigo-700 transition-colors">{label}</span>
                </div>
                {sublabel && <p className="text-[12px] text-slate-400 font-medium mt-1 truncate group-hover:text-indigo-400 transition-colors" dir="rtl">{sublabel}</p>}
            </div>
            {hasArrow && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 relative z-10" />}
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
    const navigate = useNavigate();
    const typeInfo = TYPE_MAP[resource.type] || { label: resource.type, color: 'bg-slate-100 text-slate-600' };

    return (
        <div onClick={() => navigate(`/student/resource/${resource.id}`)} className="cursor-pointer bg-white/80 backdrop-blur-md rounded-[1.5rem] p-4 md:p-5 border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group flex gap-4 md:gap-5 items-start">
            <div className="w-12 h-14 md:w-14 md:h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-white shadow-inner flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className={`text-[10px] md:text-[11px] uppercase font-black tracking-widest rounded-lg ${typeInfo.color} px-2.5 py-1`}>
                        {typeInfo.label}
                    </span>
                    {resource.difficulty && (
                        <span className="text-[11px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Difficile {resource.difficulty}/5</span>
                    )}
                    {resource.file_size_kb && (
                        <span className="text-[11px] text-slate-400 font-bold">{Math.round(resource.file_size_kb / 1024 * 10) / 10} MB</span>
                    )}
                    {resource.is_premium && (
                        <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase shadow-sm">PREMIUM</span>
                    )}
                </div>
                <h3 className="font-black text-slate-800 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {resource.title}
                </h3>
                {showContext && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] md:text-xs text-slate-400 font-bold bg-slate-50 self-start inline-flex px-2 py-1 rounded-lg border border-slate-100">
                        <span>{resource.grade_code}</span>
                        {resource.branch_code && <> <span className="text-slate-300">•</span> <span>{resource.branch_code}</span> </>}
                        <span className="text-slate-300">•</span> <span>{resource.subject_name}</span>
                        <span className="text-slate-300">•</span> <span className="text-indigo-400">S{resource.semester}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 mt-2 md:mt-3 text-[11px] md:text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> {resource.downloads_count || 0} vues</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2 pr-2">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/student/resource/${resource.id}`) }} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-400 hover:text-white shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group-hover:animate-pulse-once">
                    <Eye className="w-5 h-5" />
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
