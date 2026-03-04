import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Download, ChevronRight, ChevronDown,
    FileText, ArrowLeft, X, Loader2,
    BookOpen, PenTool, ClipboardList, Play,
    Brain, Lightbulb, GraduationCap,
    FolderOpen
} from 'lucide-react';
import { CYCLES, GRADES, BRANCHES, SUBJECTS } from '../../data/education-hierarchy';
import { useAuth } from '../../contexts/AuthContext';

/* ─── Resource type config ─── */
const TYPE_META: Record<string, { label: string; color: string; icon: typeof FileText; group: string }> = {
    pdf_cours: { label: 'Cours', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: BookOpen, group: 'cours' },
    pdf_resume: { label: 'Résumé', color: 'bg-sky-50 text-sky-600 border-sky-100', icon: FileText, group: 'cours' },
    exercices: { label: 'Exercices', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: PenTool, group: 'exercices' },
    correction: { label: 'Correction', color: 'bg-lime-50 text-lime-600 border-lime-100', icon: PenTool, group: 'exercices' },
    quiz: { label: 'Quiz', color: 'bg-violet-50 text-violet-600 border-violet-100', icon: Brain, group: 'quiz' },
    controle_type: { label: 'Contrôle', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: ClipboardList, group: 'controles' },
    annales: { label: 'Annales', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: ClipboardList, group: 'controles' },
    methode: { label: 'Méthode', color: 'bg-pink-50 text-pink-600 border-pink-100', icon: Lightbulb, group: 'methode' },
    video_capsule: { label: 'Vidéo', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: Play, group: 'videos' },
};


type ChapterItem = {
    id: string;
    title: string;
    title_ar?: string;
    source: 'unit' | 'module';
};

export default function StudentSearch() {
    const { user } = useAuth();
    const isPremium = user?.role === 'admin' || user?.is_premium_member;

    /* ─ Search ─ */
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    /* ─ Hierarchy (hardcoded) ─ */
    const [expandedGradeCode, setExpandedGradeCode] = useState<string | null>(null);

    const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null); // grade code
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null); // branch code
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    /* ─ Subject page state ─ */
    const [activeSemester, setActiveSemester] = useState(1);
    const [chapters, setChapters] = useState<ChapterItem[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [chapterResources, setChapterResources] = useState<Record<string, any[]>>({});
    const [loadingResources, setLoadingResources] = useState<string | null>(null);

    type NavStep = 'cycle' | 'tree' | 'subject-page';
    const [step, setStep] = useState<NavStep>('cycle');

    /* ─── Derived: current grades and branches from hardcoded data ─── */
    const currentGrades = selectedCycle ? (GRADES[selectedCycle] || []) : [];
    const currentGradeLabel = currentGrades.find(g => g.code === selectedGrade)?.label || selectedGrade || '';
    const currentBranchLabel = selectedGrade ? (BRANCHES[selectedGrade] || []).find(b => b.code === selectedBranch)?.label || '' : '';

    /* ─── Derive subjects from hardcoded SUBJECTS constant ─── */
    const subjects = (() => {
        if (!selectedGrade) return [];
        const key = selectedBranch ? `${selectedGrade}_${selectedBranch}` : selectedGrade;
        const subjectNames = SUBJECTS[key] || [];
        return subjectNames.map(name => ({ id: `subj-${name}`, name, name_ar: null }));
    })();

    /* ─── Fetch chapters when subject selected + semester changes ─── */
    useEffect(() => {
        if (!selectedSubject || !selectedGrade) return;

        const branchCode = selectedBranch || '';
        const url = `/api/modules-by-tags?gradeCode=${selectedGrade}&semester=${activeSemester}&subject=${encodeURIComponent(selectedSubject.name)}${branchCode ? `&branchCode=${branchCode}` : ''}`;

        fetch(url).then(r => r.json())
            .then((mods: any[]) => {
                const results: ChapterItem[] = mods.map(m => ({ id: m.id, title: m.title, source: 'module' as const }));
                setChapters(results);
                setExpandedChapter(null);
                setChapterResources({});
            }).catch(console.error);
    }, [selectedSubject, selectedGrade, selectedBranch, activeSemester]);

    /* ─── Load resources for a chapter when expanded ─── */
    const toggleChapter = async (ch: ChapterItem) => {
        if (expandedChapter === ch.id) {
            setExpandedChapter(null);
            return;
        }
        setExpandedChapter(ch.id);

        if (chapterResources[ch.id]) return; // already loaded

        setLoadingResources(ch.id);
        try {
            const endpoint = ch.source === 'unit'
                ? `/api/resources?unitId=${ch.id}`
                : `/api/module-resources?moduleId=${ch.id}`;
            const res = await fetch(endpoint).then(r => r.json());
            setChapterResources(prev => ({ ...prev, [ch.id]: res }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingResources(null);
        }
    };

    /* ─── Search ─── */
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

    /* ─── Navigation ─── */
    const selectCycle = (c: string) => { setSelectedCycle(c); setStep('tree'); };

    const selectFromTree = (gradeCode: string, branchCode?: string) => {
        setSelectedGrade(gradeCode);
        setSelectedBranch(branchCode || null);
        setStep('subject-page');
    };

    const goBack = () => {
        if (step === 'subject-page' && selectedSubject) {
            setSelectedSubject(null); setChapters([]); setChapterResources({}); setExpandedChapter(null);
        } else if (step === 'subject-page') {
            setSelectedGrade(null); setSelectedBranch(null); setStep('tree');
        } else if (step === 'tree') {
            setSelectedCycle(null); setExpandedGradeCode(null); setStep('cycle');
        }
    };

    const resetAll = () => {
        setSelectedCycle(null); setSelectedGrade(null); setSelectedBranch(null); setSelectedSubject(null);
        setChapters([]); setChapterResources({}); setExpandedChapter(null);
        setExpandedGradeCode(null);
        setStep('cycle'); setActiveSemester(1);
    };


    const isSearchActive = searchQuery.length >= 2;

    /* ══════════════════════════════════════
       SUBJECT PAGE — Simple AlloSchool-style
       ══════════════════════════════════════ */
    if (step === 'subject-page' && selectedSubject) {
        return (
            <div className="max-w-[900px] mx-auto w-full">
                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { label: 'Bibliothèque', onClick: resetAll },
                    { label: selectedCycle || '' },
                    { label: currentGradeLabel },
                    ...(currentBranchLabel ? [{ label: currentBranchLabel }] : []),
                    { label: selectedSubject.name, active: true },
                ]} />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">{selectedSubject.name}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {currentGradeLabel} {currentBranchLabel ? `• ${currentBranchLabel}` : ''}
                        </p>
                    </div>
                </div>

                {/* Semester Sections */}
                {[1, 2].map(sem => (
                    <div key={sem} className="mb-4">
                        {/* Semester Header Bar */}
                        <button
                            onClick={() => setActiveSemester(activeSemester === sem ? 0 : sem)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 text-white rounded-lg mb-0"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">📁</span>
                                <span className="font-bold text-sm md:text-base">Semestre {sem} (Cours et Exercices)</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center text-white text-lg font-bold ${activeSemester === sem ? '' : ''}`}>
                                {activeSemester === sem ? '−' : '+'}
                            </div>
                        </button>

                        {/* Chapter List */}
                        {activeSemester === sem && (
                            <div className="bg-white border border-slate-200 border-t-0 rounded-b-lg overflow-hidden">
                                {chapters.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-slate-400">
                                        Aucun chapitre disponible pour ce semestre.
                                    </div>
                                ) : (
                                    chapters.map((ch, idx) => {
                                        const allRes = chapterResources[ch.id] || [];
                                        const resources = isPremium ? allRes : allRes.filter((r: any) => !r.is_premium);
                                        const isLoading = loadingResources === ch.id;
                                        const coursRes = resources.filter(r => r.type === 'pdf_cours' || r.type === 'pdf_resume');
                                        const exoRes = resources.filter(r => r.type === 'exercices' || r.type === 'correction');

                                        return (
                                            <div
                                                key={ch.id}
                                                className={`flex items-start gap-3 px-4 py-3 md:py-4 border-b border-slate-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                                onClick={() => { if (!chapterResources[ch.id]) toggleChapter(ch); }}
                                            >
                                                {/* Number */}
                                                <span className="text-sm font-bold text-slate-400 w-6 shrink-0 text-right mt-0.5">{idx + 1}</span>

                                                {/* Title */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm md:text-base font-medium text-slate-800">{ch.title}</p>
                                                    {ch.title_ar && (
                                                        <p className="text-xs text-slate-400 mt-0.5" dir="rtl">{ch.title_ar}</p>
                                                    )}
                                                </div>

                                                {/* Resource Links */}
                                                <div className="flex flex-col items-end gap-1 shrink-0 text-right">
                                                    {isLoading ? (
                                                        <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                                                    ) : resources.length > 0 ? (
                                                        <>
                                                            {coursRes.length > 0 && (
                                                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                                                    <span className="text-xs font-bold text-emerald-600">Cours</span>
                                                                    {coursRes.map((r, i) => (
                                                                        <a key={r.id} href={`/student/resource/${r.id}`}
                                                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
                                                                            onClick={e => e.stopPropagation()}>
                                                                            {i + 1}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {exoRes.length > 0 && (
                                                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                                                    <span className="text-xs font-bold text-blue-600">Exercices</span>
                                                                    {exoRes.map((r, i) => (
                                                                        <a key={r.id} href={`/student/resource/${r.id}`}
                                                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                                                            onClick={e => e.stopPropagation()}>
                                                                            {i + 1}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {resources.filter(r => r.type === 'video_capsule').length > 0 && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs font-bold text-red-500">Vidéos</span>
                                                                    {resources.filter(r => r.type === 'video_capsule').map((r, i) => (
                                                                        <a key={r.id} href={`/student/resource/${r.id}`}
                                                                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                                                                            onClick={e => e.stopPropagation()}>
                                                                            {i + 1}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleChapter(ch); }}
                                                            className="text-xs text-slate-400 hover:text-indigo-500 font-medium"
                                                        >
                                                            Charger ↓
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Examens Section */}
                <div className="mb-4">
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 text-white rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📝</span>
                            <span className="font-bold text-sm md:text-base">Devoirs et Examens</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 border-t-0 rounded-b-lg p-4 text-sm text-slate-400 text-center">
                        Les devoirs et examens seront disponibles prochainement.
                    </div>
                </div>
            </div>
        );
    }

    /* ══════════════════════════════════════
       SUBJECT LIST (inside subject-page step)
       ══════════════════════════════════════ */
    if (step === 'subject-page' && !selectedSubject) {
        return (
            <div className="max-w-[1100px] mx-auto w-full animate-in fade-in duration-300">
                <Breadcrumb items={[
                    { label: 'Bibliothèque', onClick: resetAll },
                    { label: selectedCycle || '' },
                    { label: selectedGrade || '' },
                    ...(currentBranchLabel ? [{ label: currentBranchLabel }] : []),
                ]} />

                <div className="flex items-center gap-4 mb-6 mt-4">
                    <button onClick={goBack} className="w-12 h-12 rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300 group shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Choisir une matière</h1>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">
                            {currentGradeLabel} {currentBranchLabel ? `• ${currentBranchLabel}` : ''}
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects.map(s => (
                        <button key={s.id} onClick={() => { setSelectedSubject(s); setActiveSemester(1); }}
                            className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-left hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-white shadow-inner">
                                    <GraduationCap className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-[15px] text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{s.name}</h3>
                                    {s.name_ar && <p className="text-xs text-slate-400 font-medium mt-0.5 truncate" dir="rtl">{s.name_ar}</p>}
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 ml-auto" />
                            </div>
                        </button>
                    ))}
                </div>

                {subjects.length === 0 && (
                    <EmptyState text="Aucune matière disponible" sub="Des matières seront ajoutées prochainement." />
                )}
            </div>
        );
    }

    /* ══════════════════════════════════════
       MAIN BROWSE + SEARCH
       ══════════════════════════════════════ */
    return (
        <div className="max-w-[1100px] mx-auto w-full">
            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
                <input type="text"
                    placeholder="Rechercher un cours, exercice, examen..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pl-14 pr-14 py-4 md:py-5 text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                )}
                {isSearching && <Loader2 className="w-5 h-5 text-slate-400 absolute right-14 top-1/2 -translate-y-1/2 animate-spin" />}
            </div>

            {/* Search Results */}
            {isSearchActive ? (() => {
                const visibleResults = isPremium ? searchResults : searchResults.filter((r: any) => !r.is_premium);
                return (
                    <div className="animate-in fade-in duration-200">
                        <p className="text-sm font-semibold text-slate-400 mb-4">
                            {visibleResults.length} résultat{visibleResults.length !== 1 ? 's' : ''} pour « {searchQuery} »
                        </p>
                        {visibleResults.length === 0 && !isSearching ? (
                            <EmptyState text="Aucun résultat trouvé." sub="Essayez un autre terme de recherche." />
                        ) : (
                            <div className="flex flex-col gap-3">
                                {visibleResults.map(r => <SearchResultCard key={r.id} resource={r} />)}
                            </div>
                        )}
                    </div>
                )
            })() : (
                <>
                    {/* Navigation header */}
                    {step !== 'cycle' && (
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={goBack} className="w-10 h-10 rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group">
                                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                            </button>
                            <Breadcrumb items={[
                                { label: 'Bibliothèque', onClick: resetAll },
                                ...(selectedCycle ? [{ label: selectedCycle }] : []),
                            ]} />
                        </div>
                    )}

                    {/* Cycle Selection */}
                    {step === 'cycle' && (
                        <>
                            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-5 md:p-8">
                                <p className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-6">
                                    Choisir un cycle
                                </p>
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                                    {CYCLES.map(c => (
                                        <NavButton key={c.code} onClick={() => selectCycle(c.code)} label={c.label} sublabel={c.label_ar} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-center py-16 animate-in fade-in duration-500 delay-150">
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
                                    <Search className="w-6 h-6 text-indigo-400" />
                                </div>
                                <p className="text-slate-500 font-semibold text-sm">Navigue ou recherche pour trouver tes documents</p>
                            </div>
                        </>
                    )}

                    {/* Tree View: Grades with nested Branches */}
                    {step === 'tree' && (
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-5 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <p className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-6">
                                Choisir un niveau et une filière
                            </p>
                            <div className="flex flex-col gap-2">
                                {currentGrades.map(grade => {
                                    const isExpanded = expandedGradeCode === grade.code;
                                    const gradeBranches = BRANCHES[grade.code] || [];
                                    const hasBranches = gradeBranches.length > 0;

                                    return (
                                        <div key={grade.code} className="rounded-2xl overflow-hidden border border-slate-100/80 transition-all duration-300">
                                            {/* Grade Header */}
                                            <button
                                                onClick={() => {
                                                    if (hasBranches) {
                                                        setExpandedGradeCode(isExpanded ? null : grade.code);
                                                    } else {
                                                        selectFromTree(grade.code);
                                                    }
                                                }}
                                                className={`w-full flex items-center gap-3.5 px-4 py-3.5 md:px-5 md:py-4 text-left group transition-all duration-300 ${isExpanded
                                                    ? 'bg-indigo-50/80 border-b border-indigo-100'
                                                    : 'bg-white hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isExpanded
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-500 group-hover:scale-110'
                                                    }`}>
                                                    <FolderOpen className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`font-bold text-[15px] transition-colors ${isExpanded ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-600'
                                                        }`}>{grade.label}</span>
                                                    {grade.label_ar && (
                                                        <p className="text-xs text-slate-400 font-medium mt-0.5" dir="rtl">{grade.label_ar}</p>
                                                    )}
                                                </div>
                                                {hasBranches ? (
                                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-indigo-500' : 'text-slate-300 group-hover:text-indigo-400'}`} />
                                                    </div>
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
                                                )}
                                            </button>

                                            {/* Branches nested under grade */}
                                            {isExpanded && hasBranches && (
                                                <div className="bg-slate-50/50 animate-in slide-in-from-top-1 fade-in duration-200">
                                                    {gradeBranches.map(b => (
                                                        <button
                                                            key={b.code}
                                                            onClick={() => selectFromTree(grade.code, b.code)}
                                                            className="w-full flex items-center gap-3 pl-14 pr-5 py-3 text-left hover:bg-indigo-50/60 transition-all duration-200 group border-b border-slate-100/60 last:border-b-0"
                                                        >
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                                                                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                            </div>
                                                            <span className="text-[14px] font-semibold text-slate-600 group-hover:text-indigo-700 transition-colors truncate">
                                                                {b.label}
                                                            </span>
                                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 ml-auto" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/* ─── Sub-components ─── */

function NavButton({ label, sublabel, code, onClick }: {
    label: string; sublabel?: string; code?: string; onClick: () => void;
}) {
    return (
        <button onClick={onClick}
            className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm text-left font-bold text-[15px] text-slate-700 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="min-w-0 relative z-10">
                <div className="flex items-center gap-2.5">
                    {code && <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg tracking-wide">{code}</span>}
                    <span className="truncate group-hover:text-indigo-700 transition-colors">{label}</span>
                </div>
                {sublabel && <p className="text-[12px] text-slate-400 font-medium mt-1 truncate group-hover:text-indigo-400 transition-colors" dir="rtl">{sublabel}</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 relative z-10" />
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


function SearchResultCard({ resource }: { resource: any }) {
    const navigate = useNavigate();
    const meta = TYPE_META[resource.type] || { label: resource.type, color: 'bg-slate-50 text-slate-600 border-slate-100', icon: FileText };

    return (
        <div onClick={() => navigate(`/student/resource/${resource.id}`)}
            className="cursor-pointer bg-white/80 backdrop-blur-md rounded-[1.5rem] p-4 md:p-5 border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group flex gap-4 items-start">
            <div className="w-12 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-white shadow-inner flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] uppercase font-black tracking-widest rounded-lg ${meta.color} border px-2 py-0.5`}>{meta.label}</span>
                    {resource.is_premium && (
                        <span className="bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-900 text-[9px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase">PRO</span>
                    )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">{resource.title}</h3>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-bold">
                    {resource.subject_name && <span>{resource.subject_name}</span>}
                    {resource.unit_title && <><span className="text-slate-300">•</span><span className="text-indigo-400">{resource.unit_title}</span></>}
                    {resource.grade_code && <><span className="text-slate-300">•</span><span>{resource.grade_code}</span></>}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {resource.downloads_count || 0}</span>
                </div>
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
