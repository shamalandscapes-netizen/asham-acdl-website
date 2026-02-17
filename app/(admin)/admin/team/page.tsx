'use client';

import { useEffect, useState } from 'react';
import { 
  Users, ShieldCheck, Briefcase, Key, 
  UserCircle, Loader2, Search, Mail 
} from 'lucide-react';
import { createClient } from '@/supabase/client';

const ROLES = ['customer', 'staff', 'accountant', 'it_admin', 'admin'];

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchUsers() {
    setLoading(true);
    // FIX: Cast as any to bypass potential 'never' type result
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (!error && data) setUsers(data);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    // FIX: Cast supabase as any to allow updating a table not in the TS schema
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert("Failed to update role: " + error.message);
    }
    setUpdatingId(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-[#C75B39] mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Team Directory...</p>
    </div>
  );

  return (
    // FIXED: Using standard property for transition duration to avoid build warnings
    <div className="space-y-8 [transition-duration:500ms] animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">Team & Permissions</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign roles and access levels to users</p>
      </div>

      {/* User Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50/30">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 text-gray-400 bg-gray-100 rounded-full">
                        <UserCircle size={24} />
                      </div>
                      <span className="font-bold text-gray-900">{user.full_name || 'Unnamed User'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} className="text-gray-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border 
                      ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 
                        user.role === 'accountant' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        user.role === 'customer' ? 'bg-gray-50 text-gray-400 border-gray-100' : 
                        'bg-green-50 text-green-600 border-green-100'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <select 
                        title="Update user role"
                        disabled={updatingId === user.id}
                        className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#C75B39] cursor-pointer disabled:opacity-50"
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                      >
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
