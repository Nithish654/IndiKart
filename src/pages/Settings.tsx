import React, { useState, useContext, useEffect } from 'react';
import { Save, Store, Mail, Bell, Shield, Loader } from 'lucide-react';
import { StoreContext } from '../App';
import { api } from '../services/api';
import { StoreSettings } from '../types';

const Settings = () => {
  const { addToast } = useContext(StoreContext)!;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<StoreSettings>({
    storeName: '',
    email: '',
    currency: 'INR',
    taxRate: '0',
    notifications: true,
  });

  useEffect(() => {
      const fetchSettings = async () => {
          try {
              const data = await api.getSettings();
              setFormData(data);
          } catch (error) {
              addToast("Failed to load settings", "error");
          } finally {
              setLoading(false);
          }
      };
      fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        await api.updateSettings(formData);
        addToast("Settings saved successfully!", "success");
    } catch (error) {
        addToast("Failed to save settings", "error");
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return <div className="flex justify-center p-12"><Loader className="animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store preferences</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-200 disabled:opacity-70"
        >
            {saving ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Save size={18} />
            )}
            <span>Save Changes</span>
        </button>
      </div>

      <div className="grid gap-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Store size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">General Information</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input 
                        type="text" 
                        value={formData.storeName}
                        onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                    />
                </div>
             </div>
          </div>

          {/* Payment & Tax */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Shield size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Payment & Tax</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white transition"
                    >
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="USD">US Dollar (USD)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                    <input 
                        type="number" 
                        value={formData.taxRate}
                        onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                    />
                </div>
             </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Bell size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
             </div>
             
             <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div>
                    <h3 className="font-medium text-gray-900">Order Alerts</h3>
                    <p className="text-sm text-gray-500">Receive email notifications for new orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.notifications}
                        onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Settings;
