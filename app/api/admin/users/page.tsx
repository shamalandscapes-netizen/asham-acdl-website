'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, 
  Search, 
  Shield, 
  UserCheck, 
  User as UserIcon,
  Loader2
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'staff' | 'it' | 'accounts' | 'customer';
  created_at: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null); // Stores ID of user being updated

  const supabase = createClient();

  // 1. Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      alert('Error: You might not have permission to view users.');
    } else {
      setUsers(data as UserProfile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Role Change
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    
    setUpdating(userId);

    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Failed to update role. Only Super Admins can do this.');
    } else {
      // Optimistic Update
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    }
    setUpdating(null);
  };

  // 3. Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(search.toLowerCase()) || 
      user.full_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'staff' ? ['super_admin', 'staff', 'it', 'accounts'].includes(user.role) : user.role === 'customer');

    return matchesSearch && matchesRole;
  });

  // Helper: Role Badge Color
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'it': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accounts': return 'bg-green-100 text-green-700 border-green-200';
      case 'staff': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage customers and assign staff roles.</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border border-gray-200 shadow-sm md:flex-row rounded-xl">
        
        {/* Role Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          {['all', 'staff', 'customer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterRole(tab)}
              className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                filterRole === tab 
                  ? 'bg-white text-[#06392F] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        
        {loading ? (
           <div className="flex flex-col items-center p-12 text-center text-gray-500">
              <Loader2 className="mb-2 animate-spin" /> Loading users...
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">User Details</th>
                  <th className="px-6 py-4 font-medium">Current Role</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium text-right">Manage Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50">
                    
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-gray-500 bg-gray-100 rounded-full">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-[#06392F]">{user.full_name || 'No Name'}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 w-fit ${getRoleBadge(user.role)}`}>
                        {user.role === 'super_admin' && <Shield size={12} />}
                        {user.role === 'customer' && <UserIcon size={12} />}
                        {['staff', 'it', 'accounts'].includes(user.role) && <UserCheck size={12} />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {updating === user.id ? (
                        <div className="flex justify-end text-xs text-gray-400">
                          <Loader2 className="mr-1 animate-spin" size={16} /> Updating...
                        </div>
                      ) : (
                        <select 
                          className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-[#06392F] focus:border-[#06392F] block w-full md:w-auto p-2 cursor-pointer"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff (General)</option>
                          <option value="accounts">Accounts Team</option>
                          <option value="it">IT Support</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}