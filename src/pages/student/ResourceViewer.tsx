import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Sparkles, ArrowLeft, Crown, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type ResourceDetail = {
    id: string;
    title: string;
    type: string;
    file_url: string;
    is_premium: boolean;
};

export default function ResourceViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [resource, setResource] = useState<ResourceDetail | null>(null);
    const [isPremiumLocked, setIsPremiumLocked] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!id || !token) return;

        const loadResource = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/api/student/resource/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 403) {
                    setIsPremiumLocked(true);
                    return;
                }

                if (!res.ok) {
                    setErrorMsg('Ressource introuvable ou accès refusé.');
                    return;
                }

                const data = await res.json();
                setResource(data.resource);
            } catch (err) {
                setErrorMsg('Erreur de connexion.');
            } finally {
                setIsLoading(false);
            }
        };

        loadResource();
    }, [id, token]);

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-6 text-slate-500 font-bold text-lg animate-pulse">Préparation de la ressource...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{errorMsg}</h2>
                <Button onClick={() => navigate(-1)} variant="outline" className="mt-4 rounded-full font-bold">Retour</Button>
            </div>
        );
    }

    // --- PREMIUM PAYWALL SATE ---
    if (isPremiumLocked) {
        return (
            <div className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Retour
                </button>

                <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-1 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-2xl shadow-amber-500/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="relative bg-slate-950 rounded-[2.8rem] p-12 lg:p-16 text-center overflow-hidden h-full flex flex-col items-center justify-center">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-1 mb-8 shadow-2xl shadow-amber-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                            <div className="w-full h-full bg-slate-950 rounded-[1.3rem] flex items-center justify-center">
                                <Crown className="w-10 h-10 text-amber-400" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight max-w-2xl mx-auto">
                            Libérez tout votre potentiel avec l'accès Premium
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 font-medium">
                            Cette ressource est exclusivement réservée aux membres Premium. Rejoignez l'élite et accédez à l'intégralité du programme national.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12 text-left">
                            {[
                                "Accès illimité à tous les cours PDF",
                                "Vidéos de corrections exclusives",
                                "Simulateurs d'examens nationaux",
                                "Support prioritaire 24/7"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                    <span className="text-slate-200 font-bold text-sm tracking-wide">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg px-12 py-8 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all hover:scale-105">
                            <Sparkles className="w-6 h-6 mr-3" />
                            Déverrouiller le Contenu Premium
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- SUCCESS STATE: SHOW RESOURCE ---
    return (
        <div className="max-w-[1400px] mx-auto h-[85vh] flex flex-col animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{resource?.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {resource?.is_premium ? (
                                <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-xs">PREMIUM</span>
                            ) : (
                                <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs">STANDARD</span>
                            )}
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{resource?.type.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden border-none shadow-2xl relative">
                {/* Fallback viewer implementation depending on format: Iframe for PDF, Video tag for Videos */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white bg-slate-800">
                    <FileText className="w-24 h-24 text-slate-600 mb-6" />
                    <h3 className="text-3xl font-black mb-4">Visionneuse de Document Activable</h3>
                    <p className="text-slate-400 max-w-lg font-medium text-lg mb-8">
                        Le fichier "<strong>{resource?.title}</strong>" serait affiché ici en plein écran (via iframe PDF ou lecteur Vidéo HD). Le fichier ciblé est : {resource?.file_url}
                    </p>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent rounded-full px-8 font-bold">
                        Ouvrir dans un nouvel onglet
                    </Button>
                </div>
            </Card>
        </div>
    );
}
