'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import {
  ArrowLeft, Save, Loader2, Mail, User, Shield,
  Phone, Building, MapPin, Globe, Lock, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'accounts' | 'employee' | 'customer';
  is_active: boolean | null;
  created_at: string;
  phone_number?: string | null;
  department?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

const ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'customer', label: 'Customer' },
];

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    if (!id) {
      toast.error('No user ID provided');
      router.push('/admin/users');
      return;
    }

    setLoading(true);
    try {
      // Get current logged in user to check permissions
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in');
        router.push('/login');
        return;
      }

      const { data: currentUserData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setCurrentUser(currentUserData);

      // Check if current user has permission to edit
      if (currentUserData?.role !== 'super_admin' && currentUserData?.role !== 'admin') {
        toast.error('You do not have permission to edit users');
        router.push('/admin/users');
        return;
      }

      // Load the user to edit
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!userData) {
        toast.error('User not found');
        router.push('/admin/users');
        return;
      }

      // Super admins can edit anyone, admins can't edit super admins
      if (currentUserData.role === 'admin' && userData.role === 'super_admin') {
        toast.error('Admins cannot edit super admins');
        router.push('/admin/users');
        return;
      }

      setProfile(userData);
    } catch (error: any) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentUser) return;

    setSaving(true);
    try {
      // Prepare update data
      const updateData: Partial<Profile> = {
        full_name: profile.full_name,
        role: profile.role,
        is_active: profile.is_active,
        phone_number: profile.phone_number || null,
        department: profile.department || null,
        address: profile.address || null,
        city: profile.city || null,
        country: profile.country || null,
      };

      // Update the profile in database
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      // Update auth metadata if role changed
      if (profile.role !== profile.role) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          profile.id,
          { app_metadata: { role: profile.role } }
        );
        
        if (authError) {
          console.warn('Failed to update auth metadata:', authError);
          // Continue anyway since profile was updated
        }
      }

      toast.success('User updated successfully');
      
      // Redirect back to user dossier
      setTimeout(() => {
        router.push(`/admin/users/${profile.id}`);
      }, 1000);

    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!profile?.email) {
      toast.error('User has no email address');
      return;
    }

    if (!confirm('Send password reset email to this user?')) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#C75B39]" />
          <p className="mt-4 text-lg font-semibold">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">User Not Found</h2>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-6 px-6 py-3 font-medium text-white rounded-xl bg-[#C75B39] hover:bg-[#b35233]"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = isSuperAdmin || currentUser?.role === 'admin';
  const canEditSuperAdmin = isSuperAdmin;
  const canChangeRole = isSuperAdmin || (isAdmin && profile.role !== 'super_admin');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/admin/users/${profile.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-lg text-slate-600 hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to User
          </button>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-[#06392F] flex items-center justify-center text-xl font-bold text-white">
                {profile.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit User</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Update profile information for {profile.full_name || 'this user'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">User ID</p>
                <p className="font-medium truncate">{profile.id}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Email</p>
                <p className="font-medium truncate">{profile.email || 'No email'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  placeholder="Email cannot be changed"
                />
                <p className="text-xs text-slate-500 mt-2">Email addresses cannot be modified</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                  placeholder="+254 700 000 000"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </div>
                </label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value as any })}
                  disabled={!canChangeRole}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {ROLES.map((role) => (
                    <option 
                      key={role.value} 
                      value={role.value}
                      disabled={!canEditSuperAdmin && role.value === 'super_admin'}
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
                {!canChangeRole && (
                  <p className="text-xs text-slate-500 mt-2">You cannot change this user's role</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Department
                  </div>
                </label>
                <input
                  type="text"
                  value={profile.department || ''}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                  placeholder="e.g., Sales, Marketing, IT"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={profile.is_active === true}
                      onChange={() => setProfile({ ...profile, is_active: true })}
                      className="w-4 h-4 text-[#C75B39] focus:ring-[#C75B39]"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={profile.is_active === false}
                      onChange={() => setProfile({ ...profile, is_active: false })}
                      className="w-4 h-4 text-[#C75B39] focus:ring-[#C75B39]"
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Address Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </div>
                  </label>
                  <input
                    type="text"
                    value={profile.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                    placeholder="Street address"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                    placeholder="City"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Country
                    </div>
                  </label>
                  <input
                    type="text"
                    value={profile.country || ''}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C75B39]/20 focus:border-[#C75B39] outline-none"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white rounded-xl bg-[#C75B39] hover:bg-[#b35233] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/admin/users/${profile.id}`)}
                className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            {/* Password Reset */}
            {profile.email && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl text-amber-600 hover:bg-amber-50 border border-amber-200"
              >
                <Lock className="w-4 h-4" />
                Send Password Reset
              </button>
            )}
          </div>
        </form>

        {/* Danger Zone */}
        {isSuperAdmin && (
          <div className="mt-8 bg-white rounded-2xl border border-rose-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-rose-700 mb-4">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-rose-700">Delete User Account</h3>
                    <p className="text-sm text-rose-600 mt-1">
                      Permanently delete this user account and all associated data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
                      
                      try {
                        // First soft delete by deactivating
                        const { error } = await supabase
                          .from('profiles')
                          .update({ is_active: false })
                          .eq('id', profile.id);
                        
                        if (error) throw error;
                        
                        toast.success('User account deactivated');
                        router.push('/admin/users');
                      } catch (error) {
                        toast.error('Failed to delete user');
                      }
                    }}
                    className="px-6 py-2 font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 whitespace-nowrap"
                  >
                    Delete Account
                  </button>
                </div>

                {profile.role !== 'customer' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-amber-700">Convert to Customer</h3>
                      <p className="text-sm text-amber-600 mt-1">
                        Change this staff member's role to customer.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm('Convert this staff member to a customer? They will lose staff privileges.')) return;
                        setProfile({ ...profile, role: 'customer' });
                      }}
                      className="px-6 py-2 font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 whitespace-nowrap"
                    >
                      Convert to Customer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}