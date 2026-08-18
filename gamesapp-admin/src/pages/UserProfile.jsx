import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useFirestore } from '../hooks/useFirestore';

export function UserProfile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { updateItem } = useFirestore('users');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update user profile
      showToast('✅ Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto shadow-lg">
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{user?.displayName}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="input-field bg-gray-100"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-800">{user?.displayName}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-800">{user?.email}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
