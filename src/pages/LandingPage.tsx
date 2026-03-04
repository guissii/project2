import { useState, useEffect } from 'react';
import {
  Search, BookOpen, Star, MapPin, Mail, ShieldCheck, Zap, Award,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

      {/* 2. Hero Section - Human & Relatable */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-50/50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-amber-100/40 to-orange-200/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Column: Copy */}
            <div className="flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-amber-50 text-amber-800 font-bold text-sm mb-8 shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Rejoignez +45,000 lycéens marocains
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-6">
                Fini les nuits blanches à chercher des <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">anciens examens.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl">
                On sait à quel point le Bac et le lycée peuvent stresser. C'est pourquoi on a rassemblé <strong>tous les cours, résumés et examens nationaux</strong> au même endroit. Zéro pub, 100% gratuit.
              </p>

              {/* Moteur de Recherche Héroïque */}
              <div className="w-full max-w-xl bg-white p-2 sm:p-3 rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row items-center gap-2 border border-slate-200/80 mb-10 group">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <Search className="w-5 h-5 text-amber-500 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Examens Nationaux Math ou SVT..."
                    className="w-full bg-transparent py-3 text-slate-900 focus:outline-none text-lg font-semibold placeholder:text-slate-400"
                  />
                </div>
                <Button size="lg" onClick={() => navigate('/student/search')} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-6 text-base font-bold transition-all hover:scale-105">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Student" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Student" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Student" />
                </div>
                <p className="text-sm font-bold text-slate-600">Recommandé par les profs et élèves.</p>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-150 mt-10 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-orange-100 rounded-[2.5rem] transform rotate-3 scale-105 -z-10"></div>
              <img
                src="/images/hero_students.png"
                alt="Élèves marocains révisant ensemble"
                className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce hover:animate-none">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Programme à jour</p>
                  <p className="text-sm font-black text-slate-800">Saison 2025-2026</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Struggle vs Solution (Human Narrative) */}
      <section id="plateforme" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Le système académique,<br />réinventé pour <span className="text-orange-500">l'étudiant</span>.</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">Arrêtez de perdre du temps sur Google ou dans des groupes WhatsApp encombrés. Tout le programme est là, trié, vérifié et gratuit.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-orange-100 rounded-[2.5rem] transform -rotate-3 scale-105 -z-10"></div>
              <img
                src="/images/student_night.png"
                alt="Élève révisant tard le soir"
                className="w-full h-auto object-cover rounded-[2.5rem] shadow-xl border-4 border-white"
              />
            </div>

            <div className="order-1 md:order-2">
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Arrêtez de mendier des PDFs sur les <span className="text-indigo-600 underline decoration-indigo-200">groupes WhatsApp.</span>
              </h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                On a tous connu ça : la veille du contrôle, un élève demande le résumé de Physique sur le groupe de la classe. Personne ne répond, ou on vous envoie 15 photos floues.
                <br /><br />
                Avec Taalim, chaque filière a son espace organisé. Votre téléphone devient votre meilleur classeur, la qualité en plus.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Téléchargement instantané</h4>
                    <p className="text-slate-500 font-medium">Pas de publicités qui s'ouvrent dans tous les sens. Un clic, et le cours est dans votre téléphone grâce à notre infrastructure CDN.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Qualité garantie à 100%</h4>
                    <p className="text-slate-500 font-medium">Fini les photos de cahiers mal écrites. Uniquement des cours tapés, corrigés et parfaitement conformes au programme marocain.</p>
                  </div>
                </div>
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
