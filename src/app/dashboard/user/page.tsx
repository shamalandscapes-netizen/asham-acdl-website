import { Settings, Lock, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
      
      <div className="bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl">
        
        {/* Password Reset */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 text-gray-600 bg-gray-100 rounded-lg">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Password</h3>
              <p className="text-sm text-gray-500">Change your login password</p>
            </div>
          </div>
          <button className="text-sm font-bold text-[#06392F] hover:underline">Update</button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 text-gray-600 bg-gray-100 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Manage email alerts for orders</p>
            </div>
          </div>
          <button className="text-sm font-bold text-[#06392F] hover:underline">Manage</button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-6 bg-red-50/50">
          <div>
            <h3 className="font-bold text-red-700">Delete Account</h3>
            <p className="text-xs text-red-500">Permanently remove your data</p>
          </div>
          <button className="text-sm font-bold text-red-600 hover:underline">Delete</button>
        </div>

      </div>
    </div>
  );
}
