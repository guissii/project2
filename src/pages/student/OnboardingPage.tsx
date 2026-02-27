import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, GraduationCap, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
    const { token, updateUser } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Data states
    const [cycles, setCycles] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);

    // Selection states
    const [selectedCycleId, setSelectedCycleId] = useState('');
    const [selectedGradeId, setSelectedGradeId] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const interestOptions = [
        "Préparation Bac", "Méthodologie", "Examens Nationaux",
        "Orientation Post-Bac", "Exercices corrigés", "Résumé Rapide"
    ];

    useEffect(() => {
        fetch('http://localhost:3001/api/cycles').then(r => r.json()).then(setCycles);
    }, []);

    useEffect(() => {
        if (selectedCycleId) {
            fetch(`http://localhost:3001/api/grades?cycleId=${selectedCycleId}`)
                .then(r => r.json()).then(setGrades);
        }
    }, [selectedCycleId]);

    useEffect(() => {
        if (selectedGradeId) {
            fetch(`http://localhost:3001/api/branches?gradeId=${selectedGradeId}`)
                .then(r => r.json()).then(setBranches);
        }
    }, [selectedGradeId]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/auth/onboarding', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    grade_id: selectedGradeId,
                    branch_id: selectedBranchId || null,
                    interests: selectedInterests
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                updateUser(updatedUser);
                navigate('/student'); // Will go directly to dashboard
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex flex-col items-center">

            {/* Header */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                    Taalim<span className="text-indigo-600">.</span>
                </span>
            </div>

            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-200">
                {/* Progress */}
                <div className="flex items-center justify-between mb-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {i}
                            </div>
                            {i < 3 && (
                                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > i ? 'bg-indigo-600' : 'bg-slate-100'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Quel est votre niveau ? 🎓</h2>
                            <p className="text-slate-500 font-medium mb-8">Nous personnaliserons les contenus en fonction de votre cursus.</p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Sélectionnez votre cycle</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {cycles.map(c => (
                                            <button key={c.id} onClick={() => setSelectedCycleId(c.id)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${selectedCycleId === c.id
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-indigo-300'
                                                    }`}>
                                                <span className="block font-bold text-slate-900">{c.name}</span>
                                                <span className="block text-sm text-slate-500 font-medium" dir="rtl">{c.name_ar}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedCycleId && grades.length > 0 && (
                                    <div className="animate-in fade-in duration-300">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Votre année (Grade)</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {grades.map(g => (
                                                <button key={g.id} onClick={() => setSelectedGradeId(g.id)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${selectedGradeId === g.id
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                        : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                                                        }`}>
                                                    <span className="block font-bold text-sm">{g.grade_code}</span>
                                                    <span className="block text-xs font-medium opacity-80 mt-1">{g.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={handleNext} disabled={!selectedGradeId}
                                className="w-full mt-10 bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                                Continuer vers la section <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Précisez votre filière 🔬</h2>
                            <p className="text-slate-500 font-medium mb-8">Nécessaire pour le Lycée afin d'afficher les bonnes matières.</p>

                            {branches.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                                    {branches.map(b => (
                                        <button key={b.id} onClick={() => setSelectedBranchId(b.id)}
                                            className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${selectedBranchId === b.id
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-slate-200 hover:border-indigo-300'
                                                }`}>
                                            <div>
                                                <span className="block font-bold text-slate-900 text-sm">{b.name}</span>
                                                <span className="block text-xs text-slate-500 font-medium mt-1" dir="rtl">{b.name_ar}</span>
                                            </div>
                                            <span className="bg-white border text-[10px] uppercase font-bold px-2 py-0.5 rounded text-slate-500 ml-2">{b.branch_code}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 mb-10">
                                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="font-bold text-slate-600">Aucune filière requise pour ce niveau.</p>
                                    <p className="text-sm text-slate-400 mt-1">Vous pouvez passer à l'étape suivante.</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={handleBack}
                                    className="px-6 py-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                    Retour
                                </button>
                                <button onClick={handleNext} disabled={branches.length > 0 && !selectedBranchId}
                                    className="flex-1 bg-slate-900 disabled:bg-slate-300 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                                    Dernière étape <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Vos objectifs 🎯</h2>
                            <p className="text-slate-500 font-medium mb-8">Qu'est-ce qui vous intéresse le plus ? (Optionnel)</p>

                            <div className="flex flex-wrap gap-3 mb-12">
                                {interestOptions.map(interest => (
                                    <button key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-5 py-3 rounded-full border-2 font-bold text-sm transition-all ${selectedInterests.includes(interest)
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 cursor-pointer hover:border-slate-300'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleBack}
                                    className="px-6 py-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                    Retour
                                </button>
                                <button onClick={handleFinish} disabled={isLoading}
                                    className="flex-1 bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:-translate-y-0.5">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>Entrer dans la Bibliothèque <Sparkles className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
