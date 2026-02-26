import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, ShieldCheck, Mail, Calendar, Search, Filter, Download } from 'lucide-react';

const mockUsers = [
    { id: '1', name: 'Youssef Amrani', email: 'y.amrani@example.com', role: 'student', grade: '2BAC SMA', joinedAt: '2025-09-02', status: 'active', downloads: 142 },
    { id: '2', name: 'Lina Benali', email: 'lina.b@example.com', role: 'student', grade: '3AC', joinedAt: '2025-09-10', status: 'active', downloads: 35 },
    { id: '3', name: 'Amina Tazi', email: 'amina.tazi@example.com', role: 'student', grade: '1BAC SE', joinedAt: '2025-09-15', status: 'suspended', downloads: 0 },
    { id: '4', name: 'Karim Hassan', email: 'admin@taalim.ma', role: 'admin', grade: 'SuperAdmin', joinedAt: '2025-08-01', status: 'active', downloads: 999 },
];

export default function UsersView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto pb-20">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Utilisateurs & Accès</h2>
                    <p className="text-slate-400 mt-2 font-medium">Gérez les comptes élèves et les privilèges d'administration nationale.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full font-bold px-6 shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Exporter CSV
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvel Utilisateur
                    </Button>
                </div>
            </div>

            {/* Main Data Table Card */}
            <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
                {/* Table Top Controls */}
                <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Rôle
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-full font-bold">
                            <Filter className="w-4 h-4 mr-2" /> Statut
                        </Button>
                    </div>
                </div>

                {/* Table Content */}
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/50 text-slate-500 border-b border-slate-800/60 uppercase tracking-widest text-[11px] font-black">
                                <tr>
                                    <th className="px-8 py-5">Identité & Contact</th>
                                    <th className="px-6 py-5">Niveau / Accès</th>
                                    <th className="px-6 py-5 text-center">Volume (DL)</th>
                                    <th className="px-6 py-5">Inscription</th>
                                    <th className="px-6 py-5">Statut</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {mockUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-inner">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200 flex items-center gap-2 text-[15px] group-hover:text-white transition-colors">
                                                        {user.name}
                                                        {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                                                        <Mail className="w-3.5 h-3.5" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className={`bg-slate-950 border-slate-700 font-bold px-3 py-1 ${user.role === 'admin' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-300'}`}>
                                                {user.grade}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="font-black text-slate-400 group-hover:text-indigo-300 transition-colors">{user.downloads}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-400 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {user.joinedAt}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.status === 'active' ? (
                                                <span className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_currentColor]"></span> Actif
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider bg-rose-500/10 px-3 py-1.5 rounded-full w-fit border border-rose-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_5px_currentColor]"></span> Suspendu
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl">
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
