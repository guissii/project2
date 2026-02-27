import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const performAuth = async (overrideEmail?: string, overridePassword?: string) => {
        setError('');
        setIsLoading(true);

        const currentEmail = overrideEmail || email;
        const currentPassword = overridePassword || password;

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin
            ? { email: currentEmail, password: currentPassword }
            : { email: currentEmail, password: currentPassword, full_name: fullName };

        try {
            const res = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                login(data.token, data.user);
                // Redirect based on role and onboarding status
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else if (!data.user.onboarding_completed) {
                    navigate('/student/onboarding');
                } else {
                    navigate('/student');
                }
            } else {
                setError(data.error || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await performAuth();
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Column - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col relative bg-slate-900 text-white overflow-hidden p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                <div className="relative z-10 flex items-center gap-3 cursor-pointer group mb-auto" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 transform group-hover:rotate-6 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">
                        Taalim<span className="text-indigo-400">.</span>
                    </span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">L'excellence académique à portée de clic.</h1>
                    <p className="text-lg text-slate-300 font-medium">Rejoignez plus de 45 000 élèves marocains et accédez instantanément à la plus grande bibliothèque de ressources éducatives.</p>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32">

                {/* Mobile Header */}
                <div className="flex lg:hidden items-center gap-2 mb-12" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900">
                        Taalim<span className="text-indigo-600">.</span>
                    </span>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        {isLogin ? 'Bon retour ! 👋' : 'Créer un compte 🚀'}
                    </h2>
                    <p className="text-slate-500 font-medium mb-8">
                        {isLogin
                            ? 'Connectez-vous pour accéder à vos cours.'
                            : 'Inscrivez-vous gratuitement en quelques secondes.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom complet</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        placeholder="Ex: Youssef Alami"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Adresse email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="vous@exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-bold text-slate-700">Mot de passe</label>
                                {isLogin && (
                                    <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Oublié ?</a>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgb(79,70,229,0.3)] transition-all flex justify-center items-center gap-2 group mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Se connecter' : "S'inscrire"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 font-medium mt-8 text-sm">
                        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="ml-2 font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            {isLogin ? "S'inscrire" : 'Se connecter'}
                        </button>
                    </p>

                    {/* Test Credentials Shortcut */}
                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 h-px bg-slate-100"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connexion Rapide (Test)</span>
                            <div className="flex-1 h-px bg-slate-100"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLogin(true);
                                    setEmail('student@taalim.ma');
                                    setPassword('password123');
                                    performAuth('student@taalim.ma', 'password123');
                                }}
                                className="px-4 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-sm font-bold text-slate-700 transition-colors text-center disabled:opacity-50"
                            >
                                🧑‍🎓 Élève Test<br /><span className="text-xs font-normal text-slate-500">Connexion instantanée</span>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLogin(true);
                                    setEmail('admin@taalim.ma');
                                    setPassword('password123');
                                    performAuth('admin@taalim.ma', 'password123');
                                }}
                                className="px-4 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-sm font-bold text-slate-700 transition-colors text-center disabled:opacity-50"
                            >
                                🛡️ Admin Test<br /><span className="text-xs font-normal text-slate-500">Connexion instantanée</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
