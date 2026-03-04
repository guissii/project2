import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, ShieldCheck, Mail, Calendar, Search, Filter, Download, Crown, Sparkles, UserX, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type UserProfile = {
    id: string;
    email: string;
    full_name: string;
    role: string;
    grade: string | null;
    branch: string | null;
    is_premium_member: boolean;
    created_at: string;
    onboarding_completed: boolean;
};

export default function UsersView() {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Fetched users:", data);
                setUsers(data);
            } else {
                console.error("Fetch failed:", res.status, res.statusText);
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePremium = async (userId: string, currentPremiumStatus: boolean) => {
        setIsUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}/premium`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ is_premium: !currentPremiumStatus })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u.id === userId ? { ...u, is_premium_member: updatedUser.is_premium_member } : u));
            }
        } catch (err) {
            console.error('Failed to toggle premium status', err);
        } finally {
            setIsUpdating(null);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;

        setIsUpdating(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                const data = await res.json();
                alert(data.error || "Erreur lors de la suppression");
            }
        } catch (err) {
            console.error('Failed to delete user', err);
            alert("Erreur réseau lors de la suppression");
        } finally {
            setIsUpdating(null);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500/50" />
                        <span className="font-bold">Chargement des utilisateurs...</span>
                    </div>
                ) : (
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
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-16 text-center text-slate-500 font-medium space-y-3">
                                                <UserX className="w-12 h-12 mx-auto text-slate-700" />
                                                <p>Aucun utilisateur trouvé.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-800/40 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-inner">
                                                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-slate-200 text-[15px] group-hover:text-white transition-colors">
                                                                    {user.full_name || 'Utilisateur Anonyme'}
                                                                </p>
                                                                {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />}
                                                                {user.is_premium_member && <Crown className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />}
                                                            </div>
                                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                                                                <Mail className="w-3.5 h-3.5" /> {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="outline" className={`bg-slate-950 border-slate-700 font-bold px-3 py-1 ${user.role === 'admin' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-300'}`}>
                                                        {user.role === 'admin' ? 'SuperAdmin' : (user.grade || 'Non spécifié')}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="font-black text-slate-400 group-hover:text-indigo-300 transition-colors">-</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.onboarding_completed ? (
                                                        <span className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_currentColor]"></span> Prêt
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-full w-fit border border-amber-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_currentColor]"></span> En attente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {user.role !== 'admin' && (
                                                            <Button
                                                                onClick={() => togglePremium(user.id, user.is_premium_member)}
                                                                disabled={isUpdating === user.id}
                                                                variant="outline"
                                                                size="sm"
                                                                className={`font-bold transition-all ${user.is_premium_member
                                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-slate-800 hover:text-white'
                                                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30'}`}
                                                            >
                                                                {isUpdating === user.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : user.is_premium_member ? (
                                                                    'Rétrograder'
                                                                ) : (
                                                                    <>
                                                                        <Sparkles className="w-4 h-4 mr-1.5" /> Upgrade PRO
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl">
                                                                    <MoreVertical className="w-5 h-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border border-slate-800 text-slate-300">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator className="bg-slate-800" />
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteUser(user.id)}
                                                                    disabled={isUpdating === user.id || user.role === 'admin'}
                                                                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
