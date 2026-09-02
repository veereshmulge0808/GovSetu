'use client';

import { Settings, User, Bell, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="input" defaultValue={user?.firstName} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="input" defaultValue={user?.lastName} disabled />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="input bg-gray-50" defaultValue={user?.email} disabled />
                <p className="text-xs text-gray-500 mt-1">Contact your administrator to change your email address.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="input bg-gray-50 text-gray-500 flex items-center">
                  {user?.role?.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
              <Button variant="primary" disabled>Save Changes</Button>
            </div>
          </div>
          
          <div className="card p-6 border-red-100 bg-red-50/30">
            <h2 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-600/80 mb-4">Permanent actions regarding your account.</p>
            <Button variant="danger" disabled>Request Account Deletion</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
