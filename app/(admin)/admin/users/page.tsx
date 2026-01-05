'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  Search, 
  Mail, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'accounts' | 'staff' | 'it' | 'customer';
  created_at: string;
}

export default function TeamManagementPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState(''); 
  const [newUserRole, setNewUserRole] = useState('staff');
  const [isCreating, setIsCreating] = useState(false);

  const supabase = createClient();

  // 1. Fetch Staff List
  async function fetchStaff() {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('role', ['super_admin', 'accounts', 'staff', 'it'])
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load team members');
    } else {
      setUsers(data as StaffUser[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  // 2. Hire Staff (Create User)
  const handleHireStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // A. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            full_name: 'New Staff Member',
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Wait a split second for the database trigger
        await new Promise(resolve => setTimeout(resolve, 1000));

        // B. Update role
        const { error: profileError } = await supabase
          .from('users')
          .update({ role: newUserRole })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success('Staff member hired successfully!');
        setNewUserEmail('');
        setNewUserPassword('');
        setShowInviteForm(false);
        fetchStaff(); 
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to hire staff');
    } finally {
      setIsCreating(false);
    }
  };

  // 3. Sack Staff (Delete User)
  const handleSackStaff = async (userId: string) => {
    if (!confirm('Are you sure you want to terminate this staff member? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'customer' }) 
        .eq('id', userId);

      if (error) throw error;

      toast.success('Staff member terminated (Access Revoked)');
      fetchStaff(); 

    } catch (error: any) {
      toast.error('Failed to terminate staff');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500">Hire, manage, and remove staff members.</p>
        </div>
        <button 
          type="button" // ✅ Explicit type
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#06392F] rounded-lg hover:bg-[#0A4D40] transition-colors shadow-sm"
        >
          <UserPlus size={20} />
          {showInviteForm ? 'Cancel Hiring' : 'Hire New Staff'}
        </button>
      </div>

      {/* --- Hiring Form (Collapsible) --- */}
      {showInviteForm && (
        <div className="p-6 border border-green-100 rounded-xl bg-green-50 animate-in slide-in-from-top-4">
          <h3 className="mb-4 text-lg font-bold text-[#06392F]">New Employee Details</h3>
          <form onSubmit={handleHireStaff} className="grid items-end grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Email Input */}
            <div>
              <label htmlFor="new-email" className="block mb-1 text-xs font-bold text-gray-500 uppercase">Email Address</label>
              <input 
                id="new-email" // ✅ ID added
                type="email" 
                required
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                placeholder="staff@asham.com"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06392F] outline-none"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="new-password" className="block mb-1 text-xs font-bold text-gray-500 uppercase">Temp Password</label>
              <input 
                id="new-password" // ✅ ID added
                type="text" 
                required
                value={newUserPassword}
                onChange={e => setNewUserPassword(e.target.value)}
                placeholder="SecurePassword123"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06392F] outline-none"
              />
            </div>

            {/* Role Select - This was causing your error */}
            <div>
              <label htmlFor="new-role" className="block mb-1 text-xs font-bold text-gray-500 uppercase">Assign Role</label>
              <select 
                id="new-role" // ✅ ID added to match htmlFor
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06392F] outline-none bg-white"
                aria-label="Assign Role" // ✅ Aria label added as backup
              >
                <option value="staff">Staff (Product Manager)</option>
                <option value="accounts">Accounts (Finance)</option>
                <option value="it">IT Support</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isCreating}
              className="w-full px-4 py-2 font-bold text-white bg-[#C75B39] rounded-md hover:bg-[#A64828] disabled:opacity-50 transition-colors"
            >
              {isCreating ? 'Processing...' : 'Confirm Hire'}
            </button>

          </form>
          <p className="flex items-center gap-1 mt-3 text-xs text-gray-500">
            <AlertTriangle size={12} />
            The user will be created immediately. Share the credentials with them securely.
          </p>
        </div>
      )}

      {/* --- Staff List Table --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="font-medium text-gray-500 border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role / Department</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} /> Loading staff data...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No staff members found. Hire someone above!
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 font-bold text-gray-600 bg-gray-100 rounded-full">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name || 'No Name Set'}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'it' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'accounts' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {user.role === 'super_admin' && <Shield size={10} className="mr-1" />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        type="button" // ✅ Explicit type
                        onClick={() => handleSackStaff(user.id)}
                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-600 hover:bg-red-50"
                        title="Terminate Employment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}