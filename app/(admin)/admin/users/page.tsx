'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, Shield, Loader2, Fingerprint, X, ShieldAlert,
  Search, Lock, ShieldCheck, Trash2, Calendar, Edit3, 
  Phone, CheckCircle2, ChevronRight, Mail, User, Key, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  is_active: boolean | null;
  created_at: string;
  phone_number: string | null;
}

interface UserSession {
  email: string | null;
  role: string | null;
  userId: string;
}

interface NewUser {
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
}

export default function TeamManagementPage() {
  const supabase = createClient();
  const router = useRouter();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Initialize newUser state
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    fullName: '',
    role: 'employee',
    phoneNumber: ''
  });

  const isSuperAdmin = userSession?.role === 'super_admin' || userSession?.email === 'noel@ashamconstruction.co.ke';
  const isAdmin = isSuperAdmin || userSession?.role === 'admin';

  const ROLES = [
    { value: 'employee', label: 'Employee', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'accounts', label: 'Accounts', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'super_admin', label: 'Super Admin', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  ];

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      setUserSession({
        email: session.user.email || null,
        role: session.user.app_metadata?.role || null,
        userId: session.user.id
      });

      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'customer')
        .order('created_at', { ascending: false });

      // Apply filters
      if (selectedRoleFilter !== 'all') {
        query = query.eq('role', selectedRoleFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('is_active', statusFilter === 'active');
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff registry');
    } finally {
      setLoading(false);
    }
  }, [supabase, router, selectedRoleFilter, statusFilter]);

  useEffect(() => { 
    fetchStaff(); 
  }, [fetchStaff]);

  const generateInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Insufficient permissions');
      return;
    }

    setIsCreating(true);
    try {
      // Generate secure temporary password
      const tempPassword = generateSecurePassword();
      
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(newUser.email, {
        data: {
          full_name: newUser.fullName.trim(),
          role: newUser.role,
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with additional info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: newUser.fullName.trim(),
            role: newUser.role,
            phone_number: newUser.phoneNumber || null,
            is_active: true
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast.success(
        <div>
          <p className="font-bold">Invitation sent successfully!</p>
          <p className="text-xs">User will receive an email to set up their account.</p>
        </div>,
        { duration: 4000 }
      );

      setNewUser({ email: '', fullName: '', role: 'employee', phoneNumber: '' });
      setShowInviteForm(false);
      fetchStaff();
      
    } catch (error: any) {
      console.error('Error inviting staff:', error);
      toast.error(error.message || 'Failed to invite staff member');
    } finally {
      setIsCreating(false);
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !isSuperAdmin) return;
    
    setIsUpdating(true);
    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(
        editingUser.id,
        { app_metadata: { role: editingUser.role } }
      );

      if (authError) throw authError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: editingUser.full_name?.trim(), 
          role: editingUser.role, 
          phone_number: editingUser.phone_number 
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      toast.success('User details updated successfully');
      setEditingUser(null);
      setShowEditModal(false);
      fetchStaff();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean | null) => {
    try {
      const newStatus = currentStatus === null ? true : !currentStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Optionally sign out the user if deactivating
      if (currentStatus === true) {
        await supabase.auth.admin.signOut(userId);
      }

      toast.success(
        currentStatus === true 
          ? 'User access suspended successfully' 
          : 'User access restored successfully'
      );
      fetchStaff();
    } catch (error: any) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleResendInvite = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      toast.success('Password reset email sent successfully');
    } catch (error: any) {
      toast.error('Failed to resend invitation');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!isSuperAdmin) {
      toast.error('Insufficient permissions');
      return;
    }

    try {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: false
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User deactivated successfully');
      setShowDeleteConfirm(null);
      fetchStaff();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const handleEditClick = (user: StaffUser) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm);
    
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#C75B39]" />
          <p className="mt-4 text-sm font-medium text-slate-600">Loading identity vault...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <ShieldAlert className="w-16 h-16 mb-4 text-rose-500" />
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-slate-600">You don't have permission to access this area.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 mt-6 font-medium text-white bg-[#C75B39] rounded-2xl hover:bg-[#b35233]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 mx-auto space-y-8 max-w-7xl md:p-8">
      
      {/* HEADER & STATS */}
      <div className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-slate-900 to-[#06392F] rounded-2xl">
                <Fingerprint className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">Identity Vault</h1>
                <p className="mt-1 text-xs font-semibold text-slate-500">Personnel Security Registry</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="px-6 py-3 font-semibold text-white rounded-2xl bg-gradient-to-r from-[#06392F] to-[#0a4d40] hover:opacity-90 flex items-center gap-2"
            >
              {showInviteForm ? <X size={16} /> : <UserPlus size={16} />}
              {showInviteForm ? 'Cancel' : 'Invite Member'}
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Members</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <User className="text-slate-400" size={24} />
            </div>
          </div>
          
          <div className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
          </div>
          
          <div className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Inactive</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">{stats.inactive}</p>
              </div>
              <ShieldAlert className="text-rose-400" size={24} />
            </div>
          </div>
          
          <div className="p-6 bg-white border rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Admins</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Shield className="text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="p-6 bg-white border rounded-2xl border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            <select
              className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* INVITE FORM */}
      {showInviteForm && (
        <div className="p-6 bg-white border shadow-lg rounded-2xl border-slate-200">
          <h3 className="mb-4 text-lg font-semibold">Invite New Team Member</h3>
          <form onSubmit={handleInviteStaff} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                required
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
                placeholder="Full Name"
                value={newUser.fullName}
                onChange={e => setNewUser({...newUser, fullName: e.target.value})}
              />
              <input
                required
                type="email"
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
                placeholder="Email Address"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="tel"
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
                placeholder="Phone Number (Optional)"
                value={newUser.phoneNumber}
                onChange={e => setNewUser({...newUser, phoneNumber: e.target.value})}
              />
              <select
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C75B39]/20"
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-3 font-medium text-white rounded-xl bg-[#C75B39] hover:bg-[#b35233] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Sending Invite...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* USER TABLE */}
      <div className="overflow-hidden bg-white border rounded-2xl border-slate-200">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 mx-auto text-slate-300" />
            <p className="mt-4 font-medium text-slate-600">No users found</p>
            {searchTerm && (
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">User</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${
                          user.is_active 
                            ? 'bg-gradient-to-br from-slate-900 to-[#06392F] text-white' 
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {generateInitials(user.full_name)}
                        </div>
                        <div>
                          <p className={`font-medium ${!user.is_active && 'text-slate-400'}`}>
                            {user.full_name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${ROLES.find(r => r.value === user.role)?.color || 'bg-slate-100 text-slate-700'}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          className="p-2 rounded-lg hover:bg-slate-100"
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>
                        
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                              className="p-2 rounded-lg hover:bg-slate-100"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4 text-slate-500" />
                            </button>
                            
                            <button
                              onClick={() => handleResendInvite(user.email!)}
                              className="p-2 rounded-lg hover:bg-slate-100"
                              title="Reset Password"
                            >
                              <Mail className="w-4 h-4 text-slate-500" />
                            </button>
                            
                            <button
                              onClick={() => setShowDeleteConfirm(user.id)}
                              className="p-2 rounded-lg hover:bg-rose-50"
                              title="Delete"
                              disabled={userSession?.userId === user.id}
                            >
                              <Trash2 className="w-4 h-4 text-rose-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border rounded-2xl border-slate-200">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold">{users.length}</span> users
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#C75B39] hover:bg-[#b35233]">
              1
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
              Next
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL (Legacy - kept for backward compatibility) */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="mt-4 space-y-4">
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl"
                value={editingUser.full_name || ''}
                onChange={e => setEditingUser({...editingUser, full_name: e.target.value})}
              />
              <input
                type="tel"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl"
                placeholder="Phone Number"
                value={editingUser.phone_number || ''}
                onChange={e => setEditingUser({...editingUser, phone_number: e.target.value})}
              />
              <select
                className="w-full px-4 py-3 bg-slate-50 rounded-xl"
                value={editingUser.role}
                onChange={e => setEditingUser({...editingUser, role: e.target.value})}
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setShowEditModal(false);
                  }}
                  className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 font-medium text-white rounded-xl bg-[#C75B39] hover:bg-[#b35233]"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl">
            <AlertCircle className="w-12 h-12 mx-auto text-rose-500" />
            <h3 className="mt-4 text-lg font-semibold text-center">Confirm Deactivation</h3>
            <p className="mt-2 text-sm text-center text-slate-600">
              Are you sure you want to deactivate this user? They will lose access immediately.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="px-6 py-3 font-medium text-white rounded-xl bg-rose-600 hover:bg-rose-700"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}