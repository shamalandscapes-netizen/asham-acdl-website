'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserPlus, Shield, Loader2, Fingerprint, X, ShieldAlert,
  Search, Lock, RefreshCcw, AlertCircle, ShieldCheck, 
  Mail, Calendar, MoreVertical, Trash2, UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffUser {
  id: string;
  full_name: string | null;
  role: string | null; 
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
}

export default function TeamManagementPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const DEFAULT_PASSWORD = "Asham123!";
  const [newUser, setNewUser] = useState({ email: '', fullName: '', role: 'employee' });

  // CHECKING CLEARANCE
  const isAdmin = currentUserRole === 'super_admin' || currentUserRole === 'admin';

  async function fetchStaff() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || null;
      setCurrentUserRole(role);

      // REDIRECT / BLOCK: If user is not an admin, we don't even run the query
      if (role === 'employee' || role === 'accounts') {
        setLoading(false);
        return;
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .neq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Registry Access Denied');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStaff(); }, []);

  // --- ACCESS DENIED UI ---
  if (!loading && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 p-12 bg-white rounded-[3rem] border border-red-50 shadow-xl shadow-red-500/5">
          <div className="inline-flex p-6 mb-4 text-red-600 rounded-full bg-red-50">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">High Clearance Required</h2>
          <p className="max-w-xs mx-auto text-xs font-bold tracking-widest uppercase text-slate-400">
            Your current role ({currentUserRole}) does not have permission to access the Identity Vault.
          </p>
        </div>
      </div>
    );
  }

  const handleHireStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; // Final safety check
    setIsCreating(true);

    try {
      if (newUser.role === 'super_admin' && currentUserRole !== 'super_admin') {
        throw new Error("UNAUTHORIZED: Privilege escalation blocked.");
      }

      const { error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: DEFAULT_PASSWORD,
        options: { data: { full_name: newUser.fullName, role: newUser.role } }
      });

      if (authError) throw authError;

      toast.success(`Access Token Provisioned for ${newUser.fullName}`);
      setNewUser({ email: '', fullName: '', role: 'employee' });
      setShowInviteForm(false);
      setTimeout(() => fetchStaff(), 1500);
    } catch (error: any) {
      toast.error(error.message || 'Onboarding failed');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSackStaff = async (userId: string, name: string) => {
    if (!isAdmin) return;
    if (!window.confirm(`CRITICAL: Revoke all access for ${name}?`)) return;

    try {
      const { error } = await (supabase as any)
        .from('user_profiles')
        .update({ role: 'customer', is_approved: false })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Clearance Revoked');
      fetchStaff();
    } catch (error: any) {
      toast.error('Termination process failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 mx-auto space-y-8 duration-500 max-w-7xl md:p-8 animate-in fade-in">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-2xl">
              <Fingerprint className="text-[#C75B39]" size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
              Identity <span className="text-[#C75B39]">Vault</span>
            </h1>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" /> Operational Security Management
          </p>
        </div>
        
        <div className="flex flex-wrap items-center w-full gap-3 md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Filter by name..."
              className="pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#C75B39]/20 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* HIDE ONBOARD BUTTON FROM NON-ADMINS */}
          {isAdmin && (
            <button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              className={`px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                showInviteForm ? 'bg-slate-800 text-white' : 'bg-[#06392F] text-white hover:bg-[#0a4d40]'
              }`}
            >
              {showInviteForm ? <X size={14} /> : <UserPlus size={14} />}
              {showInviteForm ? 'Cancel' : 'Onboard Operator'}
            </button>
          )}
        </div>
      </div>

      {/* --- PROVISIONING OVERLAY (Locked to Admin) --- */}
      {showInviteForm && isAdmin && (
        <div className="p-1 bg-gradient-to-r from-[#C75B39] to-[#06392F] rounded-[2.6rem] animate-in zoom-in-95 duration-300">
          <div className="p-8 bg-white rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <Lock className="text-amber-500" size={20} />
                <h2 className="text-sm font-black tracking-widest uppercase text-slate-800">New Clearance Provisioning</h2>
              </div>
              <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-mono font-bold">
                TEMP_KEY: {DEFAULT_PASSWORD}
              </span>
            </div>
            
            <form onSubmit={handleHireStaff} className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 px-1">Full Identity</label>
                <input required className="w-full px-5 py-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100"
                  placeholder="John Doe" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 px-1">Security Email</label>
                <input type="email" required className="w-full px-5 py-4 text-sm font-bold transition-all border-none outline-none bg-slate-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100"
                  placeholder="operator@asham.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 px-1">Clearance Level</label>
                <select className="w-full px-5 py-4 text-sm font-black uppercase border-none outline-none appearance-none cursor-pointer bg-slate-50 rounded-2xl"
                  value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="employee">Level 1: Employee</option>
                  <option value="admin">Level 2: Operations Admin</option>
                  <option value="accounts">Level 2: Finance</option>
                  <option value="super_admin">Level 3: Super Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button disabled={isCreating} type="submit" className="w-full py-4 bg-[#C75B39] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:shadow-xl hover:shadow-[#C75B39]/30 transition-all flex items-center justify-center gap-2">
                  {isCreating ? <Loader2 className="animate-spin" size={16} /> : <><UserPlus size={16}/> Confirm Access</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Shield size={14} /> Active Personnel Registry
          </h3>
          <button onClick={fetchStaff} className="hover:rotate-180 transition-transform duration-500 text-slate-400 hover:text-[#C75B39]">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</th>
                {isAdmin && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-[#06392F]" size={32}/></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-4 opacity-40">
                      <AlertCircle className="mx-auto" size={48} />
                      <p className="text-xs font-black tracking-widest uppercase">Registry Database Empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-all hover:bg-slate-50/80 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 text-sm font-black text-white bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#C75B39] transition-colors">
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight uppercase text-slate-900">{user.full_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-mono text-slate-300">ID: {user.id.slice(0, 8)}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 italic">
                               <Mail size={10} /> Internal Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-2
                        ${user.role === 'super_admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          user.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {user.role === 'super_admin' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                        {user.role?.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                        <Calendar size={12} />
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    
                    {/* HIDE ACTIONS COLUMN FROM EMPLOYEES */}
                    {isAdmin && (
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                          <button className="p-3 transition-all text-slate-400 hover:bg-slate-100 rounded-xl">
                            <MoreVertical size={16} />
                          </button>
                          <button 
                            onClick={() => handleSackStaff(user.id, user.full_name || 'Staff')}
                            className="p-3 transition-all text-rose-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                            title="Revoke Permissions"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- AUDIT FOOTER --- */}
        <div className="flex items-center justify-between px-8 py-6 text-white bg-slate-900">
          <div className="flex gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Total Operators</p>
              <p className="text-xl font-black">{users.length}</p>
            </div>
            <div className="w-[1px] bg-slate-800" />
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Clearance Active</p>
              <p className="text-xl font-black text-green-500">{users.filter(u => u.is_approved).length}</p>
            </div>
          </div>
          <div className="items-center hidden gap-3 px-6 py-3 border md:flex bg-slate-800 rounded-2xl border-slate-700">
            <UserCheck className="text-blue-400" size={16} />
            <p className="text-[10px] font-bold text-slate-300 tracking-wide uppercase">
                Registry is Currently Encrypted & Synced
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
