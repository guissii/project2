import { useState, useEffect } from 'react';
import {
  Search, BookOpen, Star, MapPin, Mail, ShieldCheck, Zap, Award,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">

      {/* 1. Header Navigation - Ultra Clean, Sticky, Apple-like */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm py-4' : 'bg-transparent border-transparent py-6'
        }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-6 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Taalim<span className="text-indigo-600">.</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10 font-bold text-[15px] text-slate-600">
            <a href="#plateforme" className="hover:text-indigo-600 transition-colors">La Plateforme</a>
            <a href="#stats" className="hover:text-indigo-600 transition-colors">Impact & Chiffres</a>
            <a href="#temoignages" className="hover:text-indigo-600 transition-colors">Avis Élèves</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 font-bold rounded-full px-6">
              Connexion
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 font-bold text-[15px] shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgb(79,70,229,0.4)] transition-all hover:-translate-y-0.5">
              Rejoindre gratuitement
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Conversion Optimized / Aggressive Marketing Copy */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/40 to-cyan-100/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 font-bold text-sm mb-8 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            +10,000 Nouveaux Résumés ajoutés cette semaine
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-[6.5rem] font-black text-slate-900 tracking-tighter leading-[0.95] mb-8 max-w-5xl">
            Arrêtez d'imprimer.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 overflow-visible py-2 inline-block">
              Dominez votre année.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-12 leading-relaxed font-medium max-w-3xl">
            La <strong className="text-slate-900 font-black relative">
              1ère base documentaire marocaine <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-400 opacity-60"></span>
            </strong> pensée exclusivement pour les élèves. Obtenez instantanément accès aux cours, séries d'exercices et corrigés nationaux. Aucun paiement. Aucune publicité.
          </p>

          {/* Moteur de Recherche Héroïque (Ultra Focus) */}
          <div className="w-full max-w-4xl bg-white p-2 sm:p-3 rounded-full shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row items-center gap-2 border border-slate-200/80 mb-14 relative z-20 group">
            <div className="flex-1 flex items-center gap-4 px-6 w-full">
              <Search className="w-6 h-6 text-indigo-500 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: Examens Nationaux SVT 2023, Résumé Ondes..."
                className="w-full bg-transparent py-4 text-slate-900 focus:outline-none text-xl lg:text-2xl font-semibold placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>
            <div className="w-full sm:w-auto flex items-center gap-3 px-2 pb-2 sm:pb-0 sm:px-0">
              <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 text-slate-500 font-bold px-4">
                Ctrl+K
              </div>
              <Button size="lg" onClick={() => navigate('/student/search')} className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white rounded-full px-12 py-8 text-lg font-bold shadow-xl shadow-slate-900/20 transition-all hover:scale-105 group-hover:bg-indigo-600">
                Lancer la recherche <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Ultra Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Student" />
                <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Student" />
                <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Student" />
                <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Student" />
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600">+45k</div>
              </div>
              <div className="text-left">
                <div className="flex gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm font-bold text-slate-700 mt-0.5">Note moyenne de 4.9/5</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Minist%C3%A8re_de_l%27%C3%A9ducation_nationale_Logo.svg/1024px-Minist%C3%A8re_de_l%27%C3%A9ducation_nationale_Logo.svg.png" className="h-10 opacity-40 grayscale" alt="Education Nationale" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conforme au</p>
                <p className="text-sm font-black text-slate-700">Programme Marocain</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Value Proposition (Bento SaaS Layout - Apple inspired) */}
      <section id="plateforme" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Le système académique,<br />réinventé pour <span className="text-indigo-600">l'étudiant</span>.</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">Arrêtez de perdre du temps sur Google ou dans des groupes WhatsApp encombrés. Tout le programme est là, trié, vérifié et gratuit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Main Feature - Long Card */}
            <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-12 overflow-hidden relative group">
              <div className="absolute right-0 top-0 w-2/3 h-full mix-blend-overlay opacity-30 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-700 group-hover:opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

              <div className="relative z-10 w-full md:w-3/4">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-none mb-6 text-xs font-bold uppercase tracking-widest px-3 py-1">Mode Hors Ligne</Badge>
                <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">Téléchargez en un clic. <br />Imprimez. Excellez.</h3>
                <p className="text-lg text-slate-300 mb-10 font-medium leading-relaxed">
                  Notre infrastructure CDN vous garantit un téléchargement quasi-instantané, même pour des livres de 200 pages. Pas de popup, pas d'inscription forcée.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-black text-white mb-1">&lt; 1s</p>
                    <p className="text-sm text-slate-400 font-bold">Temps de réponse</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-black text-white mb-1">0</p>
                    <p className="text-sm text-slate-400 font-bold">Publicité ajoutée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Search Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-colors">
              <div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Moteur Hyper-Intelligent</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Filtrez par Année (ex: 2BAC), Filière (ex: Sciences Maths), Matière et Type (Examen ou Cours). Le moteur devine ce que vous cherchez avant même d'avoir fini de taper.
                </p>
              </div>
            </div>

            {/* Personalized Dashboard Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-indigo-200 transition-colors">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                <Star className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Espace SaaS Personnel</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600 font-bold"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Librairie de Favoris</li>
                <li className="flex items-center gap-3 text-slate-600 font-bold"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Historique de révision</li>
                <li className="flex items-center gap-3 text-slate-600 font-bold"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Suivi de complétion</li>
              </ul>
            </div>

            {/* Architecture Card */}
            <div className="md:col-span-2 bg-[#f8fafc] rounded-[2.5rem] p-12 overflow-hidden relative border-2 border-slate-100">
              <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4">
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop" className="w-[400px] h-[400px] object-cover rounded-full border-8 border-white shadow-2xl opacity-80" alt="Code Structure" />
              </div>
              <div className="relative z-10 md:w-2/3">
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Programme Officiel. Structuré à la perfection.</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                  Chaque document est classifié rigoureusement : Niveau → Semestre → Matière → Chapitre. C'est l'ordre absolu pour les élèves exigeants.
                </p>
                <Button onClick={() => navigate('/student/search')} className="bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 shadow-sm rounded-full px-8 py-6 font-bold text-[15px]">
                  Aperçu du Catalogue
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Massive Real Time Stats (Stripe Style) */}
      <section id="stats" className="py-32 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl text-indigo-100 font-bold tracking-tight mb-4">L'infrastructure éducative d'un pays.</h2>
            <p className="text-indigo-200 text-xl font-medium">Rejoignez le mouvement. Gratuit. Pour toujours.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20">
            <div className="flex flex-col items-center text-center group">
              <span className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-md">12k</span>
              <span className="text-indigo-200 font-bold tracking-widest uppercase text-sm">Fichiers PDF Validés</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <span className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-md">45k</span>
              <span className="text-indigo-200 font-bold tracking-widest uppercase text-sm">Étudiants Actifs</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <span className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-md">1.2m</span>
              <span className="text-indigo-200 font-bold tracking-widest uppercase text-sm">Téléchargements</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <span className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-md">7/7</span>
              <span className="text-indigo-200 font-bold tracking-widest uppercase text-sm">Disponibilité</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 Testimonials (Social Proof) */}
      <section id="temoignages" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6">L'élite de l'éducation nationale.<br />Approuvé par les élèves.</h2>
            <p className="text-lg text-slate-500 font-medium">Découvrez comment des milliers d'étudiants marocains ont transformé leur manière d'étudier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Salma Bennani", role: "2BAC Sciences Maths - A mention TB", text: "Je passais des heures à chercher des séries corrigées sans erreurs. Avec Taalim, j'ai tout le programme exact de mon année centralisé. L'interface est incroyable.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", school: "Lycée Lyautey, Casablanca", color: "text-amber-500" },
              { name: "Ilias El Fasi", role: "1BAC Sciences Expérimentales", text: "Le moteur de recherche est fou. Tu tapes \"Pharamphe SVT\" et ça te sort directement l'examen national avec le barème. C'est le Netflix de l'éducation marocaine.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", school: "Lycée Moulay Youssef, Rabat", color: "text-amber-500" },
              { name: "Nizar Amzil", role: "Tronc Commun Sciences", text: "Le mode hors-ligne m'a sauvé. Je télécharge tous mes PDFs de Physique le dimanche soir quand j'ai le Wifi, et je bosse tranquille tout le reste de la semaine.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", school: "Lycée Victor Hugo, Marrakech", color: "text-amber-500" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-2 hover:border-indigo-100 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-6 text-amber-400">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100" alt={testimonial.name} />
                    <div>
                      <h4 className="font-extrabold text-slate-900">{testimonial.name}</h4>
                      <p className="text-xs font-bold text-slate-500 mb-0.5">{testimonial.role}</p>
                      <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">{testimonial.school}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing (Marketing Hack : It's Free) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none"></div>

            <Award className="w-16 h-16 text-amber-400 mx-auto mb-8" />
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6">Un prix imbattable.</h2>
            <div className="flex items-baseline justify-center gap-2 mb-8">
              <span className="text-7xl font-black text-white">0</span>
              <span className="text-3xl font-bold text-slate-400">Dirhams / mois</span>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              L'éducation ne devrait pas être un luxe. Accédez à 100% de la plateforme, téléchargez tous les PDFs et utilisez l'espace étudiant en illimité, sans jamais entrer de carte bancaire.
            </p>
            <Button onClick={() => navigate('/student')} className="bg-white hover:bg-slate-100 text-slate-900 rounded-full px-12 py-8 text-xl font-black shadow-xl hover:scale-105 transition-transform duration-300">
              Créer mon compte Gratuit
            </Button>
            <p className="text-slate-500 mt-6 font-medium text-sm">Prend 30 secondes • Sans carte bancaire requise</p>
          </div>
        </div>
      </section>

      {/* 6. Footer (Corporate Trust) */}
      <footer className="bg-[#f8fafc] border-t border-slate-200 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  Taalim<span className="text-indigo-600">.</span>
                </span>
              </div>
              <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-semibold text-[15px]">
                Le standard national pour la distribution et l'organisation des documents éducatifs de niveau lycée et collège au Maroc.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-all font-bold">In</div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-all font-bold">Tw</div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-200 cursor-pointer transition-all font-bold"><Mail className="w-5 h-5" /></div>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6 tracking-wider text-sm uppercase">Produit</h4>
              <ul className="space-y-4 font-bold text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Recherche PDF</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Espace Édudiant</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Statistiques</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Nouveautés</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6 tracking-wider text-sm uppercase">Ressources</h4>
              <ul className="space-y-4 font-bold text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Programme 2BAC</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Examens Nationaux</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Fiches de Lecture</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog Éducatif</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6 tracking-wider text-sm uppercase">Société</h4>
              <ul className="space-y-4 font-bold text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Conditions Générales</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2">Contact <MapPin className="w-4 h-4" /></a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-[15px] font-bold text-slate-400">
            <p>© 2026 Taalim Educational Systems. Tous droits réservés.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-slate-500">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Powered by Supabase Cloud
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
