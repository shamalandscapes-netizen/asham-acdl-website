'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserPlus, Trash2, Shield, Mail, Loader2,
  Fingerprint, X, Phone, UserCheck, ShieldAlert,
  CheckCircle, Building2, Search, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Updated interface to match your unified schema
interface StaffUser {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string; // Using string to accommodate the converted text column
  is_approved: boolean;
  is_active: boolean;
  updated_at: string | null;
  created_at?: string;
}

export default function TeamManagementPage() {
  const supabase = createClient();
  
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'employee'
  });

  // 1. Fetch Staff List (Excluding normal customers)
  async function fetchStaff() {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .neq('role', 'customer') // Only show staff/admins in this registry
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Registry Access Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStaff(); }, []);

  // 2. Hire Staff (Auth + Unified Profile Upsert)
  const handleHireStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Step A: Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { 
          data: { full_name: newUser.fullName } 
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Authentication layer failed.");

      // Step B: Strategic delay for Supabase Auth hooks
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step C: Upsert to the Unified Profiles Table
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .upsert({ 
          id: authData.user.id,
          role: newUser.role,
          full_name: newUser.fullName,
          is_approved: true, // Auto-approve internal staff
          is_active: true,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      toast.success(`Access granted to ${newUser.fullName}`);
      setNewUser({ email: '', password: '', fullName: '', role: 'employee' });
      setShowInviteForm(false);
      fetchStaff();
    } catch (error: any) {
      console.error("Hire Error:", error);
      toast.error(error.message || 'Database error saving new user');
    } finally {
      setIsCreating(false);
    }
  };

  // 3. Revoke Access (Safety switch: Demote to Customer)
  const handleSackStaff = async (userId: string, name: string) => {
    if (!window.confirm(`Revoke administrative access for ${name}?`)) return;

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ 
          role: 'customer',
          is_approved: false // Require re-approval if they return as a client
        })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Security clearance revoked.');
      fetchStaff();
    } catch (error: any) {
      toast.error('Termination sequence failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mx-auto space-y-10 duration-700 max-w-7xl animate-in fade-in">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl italic font-black tracking-tighter uppercase text-slate-900">
            Personnel Registry <Fingerprint className="text-[#C75B39]" size={28} />
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Operational Security & Permissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#06392F]" size={16} />
            <input 
              type="text"
              placeholder="Search registry..."
              className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-[#06392F]/5 w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowInviteForm(!showInviteForm)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              showInviteForm ? 'bg-slate-100 text-slate-500' : 'bg-[#06392F] text-white shadow-xl shadow-[#06392F]/20'
            }`}
          >
            {showInviteForm ? <X size={14} /> : <UserPlus size={14} />}
            <span className="ml-2">{showInviteForm ? 'Close' : 'Onboard Staff'}</span>
          </button>
        </div>
      </div>

      {/* --- ONBOARDING FORM --- */}
      {showInviteForm && (
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative overflow-hidden animate-in slide-in-from-top-4">
          <form onSubmit={handleHireStaff} className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block px-1">Full Name</label>
              <input required className="w-full px-5 py-4 text-sm font-bold bg-white border-none shadow-sm outline-none rounded-2xl"
                placeholder="Operator Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} />
            </div>
            <div className="lg:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block px-1">Login Email</label>
              <input type="email" required className="w-full px-5 py-4 text-sm font-bold bg-white border-none shadow-sm outline-none rounded-2xl"
                placeholder="email@asham.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            </div>
            <div className="lg:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block px-1">Temporary Password</label>
              <input required className="w-full px-5 py-4 text-sm font-bold bg-white border-none shadow-sm outline-none rounded-2xl"
                placeholder="Assign Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            </div>
            <div className="lg:col-span-1">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block px-1">Access Level</label>
              <select className="w-full px-5 py-4 text-sm font-black uppercase bg-white border-none shadow-sm outline-none appearance-none rounded-2xl"
                value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="employee">Staff / Field</option>
                <option value="admin">Operations Admin</option>
                <option value="accounts">Finance / Accounts</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button disabled={isCreating} type="submit" className="w-full py-4 bg-[#C75B39] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-[#C75B39]/20 hover:brightness-110 disabled:opacity-50 transition-all">
                {isCreating ? 'Provisioning...' : 'Grant Access'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- STAFF TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Level</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#06392F]" size={30}/></td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50/30 group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 text-xs font-black text-white bg-slate-900 rounded-xl">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight uppercase text-slate-900">{user.full_name}</p>
                      <p className="text-[9px] font-mono text-slate-300">UID: {user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest inline-flex items-center gap-2
                    ${user.role === 'super_admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      user.role === 'admin' ? 'bg-[#06392F]/5 text-[#06392F] border-[#06392F]/10' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {user.role === 'super_admin' && <Shield size={10} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => handleSackStaff(user.id, user.full_name || 'Staff')}
                    className="p-3 transition-all opacity-0 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl group-hover:opacity-100">
                    <ShieldAlert size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !loading && (
          <div className="py-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            No administrative personnel found
          </div>
        )}
      </div>

      {/* --- ACCESS CONTROL MATRIX --- */}
      <div className="pt-10 space-y-6">
        <div className="flex items-center gap-2 px-2">
          <h2 className="text-xl italic font-black tracking-tighter uppercase text-slate-900">Permission Matrix</h2>
          <Info size={14} className="text-slate-300" />
        </div>
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="border-b bg-slate-50/50 border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Functionality</th>
                <th className="px-6 py-5 text-[10px] font-black text-center text-rose-600 uppercase tracking-widest">Super Admin</th>
                <th className="px-6 py-5 text-[10px] font-black text-center text-[#06392F] uppercase tracking-widest">Admin</th>
                <th className="px-6 py-5 text-[10px] font-black text-center text-emerald-600 uppercase tracking-widest">Accounts</th>
                <th className="px-6 py-5 text-[10px] font-black text-center text-slate-400 uppercase tracking-widest">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { f: 'Edit Inventory / Prices', s: true, a: true, acc: true, st: false },
                { f: 'Onboard New Personnel', s: true, a: true, acc: false, st: false },
                { f: 'Approve Sales Quotes', s: true, a: true, acc: true, st: true },
                { f: 'Delete Financial Records', s: true, a: false, acc: false, st: false },
                { f: 'System Settings Access', s: true, a: false, acc: false, st: false },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/30">
                  <td className="px-8 py-5 text-xs font-bold tracking-tight uppercase text-slate-600">{row.f}</td>
                  <td className="px-6 py-5">{row.s ? <CheckCircle size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-100" />}</td>
                  <td className="px-6 py-5">{row.a ? <CheckCircle size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-100" />}</td>
                  <td className="px-6 py-5">{row.acc ? <CheckCircle size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-100" />}</td>
                  <td className="px-6 py-5">{row.st ? <CheckCircle size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-100" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}