'use client';

import { useState } from 'react';
import { User, Shield, Bell, Moon, Save } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminSettings() {
  const [theme, setTheme] = useState('light');
  const [emailNotif, setEmailNotif] = useState(true);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">Personalize your admin dashboard and manage security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Navigation Tabs */}
        <nav className="space-y-1" aria-label="Settings tabs">
          <TabButton active icon={User} label="General Profile" />
          <TabButton icon={Shield} label="Security" />
          <TabButton icon={Bell} label="Notifications" />
          <TabButton icon={Moon} label="Display" />
        </nav>

        {/* Content Area */}
        <div className="space-y-6 md:col-span-2">
          <div className="p-8 space-y-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h3 className="pb-4 font-bold text-gray-800 border-b">Personal Information</h3>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-20 h-20 text-gray-400 bg-gray-100 border-2 border-gray-300 border-dashed rounded-full">
                <User size={32} aria-hidden="true" />
              </div>
              <button className="text-sm font-bold text-[#06392F] hover:underline">Change Photo</button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input id="full-name" label="Full Name" placeholder="John Doe" />
              <Input id="email-address" label="Email" placeholder="john@asham.com" type="email" />
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="pb-4 font-bold text-gray-800 border-b">Preferences</h3>
              
              {/* --- FIXED SECTION --- */}
              <div className="flex items-center justify-between py-2">
                <label htmlFor="email-notif" className="cursor-pointer">
                  <p className="text-sm font-bold text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive alerts for new material orders.</p>
                </label>
                <input 
                  id="email-notif" // Added ID
                  type="checkbox" 
                  checked={emailNotif} 
                  onChange={() => setEmailNotif(!emailNotif)} 
                  className="w-5 h-5 accent-[#06392F] cursor-pointer"
                  aria-label="Enable email notifications" // Added Aria Label for extra clarity
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-gray-700">Dark Mode</p>
                  <p className="text-xs text-gray-500">Reduce eye strain during night shifts.</p>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-lg" role="group" aria-label="Theme selection">
                  <button 
                    onClick={() => setTheme('light')} 
                    className={`px-3 py-1 text-xs rounded-md transition-all ${theme === 'light' ? 'bg-white shadow-sm font-bold text-[#06392F]' : 'text-gray-500'}`}
                    aria-pressed={theme === 'light'}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')} 
                    className={`px-3 py-1 text-xs rounded-md transition-all ${theme === 'dark' ? 'bg-white shadow-sm font-bold text-[#06392F]' : 'text-gray-500'}`}
                    aria-pressed={theme === 'dark'}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button className="flex items-center justify-center w-full gap-2">
                <Save size={18} aria-hidden="true" /> Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active = false }: any) {
  return (
    <button 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-white text-[#06392F] shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={18} aria-hidden="true" /> {label}
    </button>
  );
}

function Input({ label, id, ...props }: any) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[10px] uppercase font-black text-gray-400 tracking-widest cursor-pointer">
        {label}
      </label>
      <input 
        id={id} // Link the ID to the label
        {...props} 
        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#06392F] outline-none transition-all" 
      />
    </div>
  );
}
