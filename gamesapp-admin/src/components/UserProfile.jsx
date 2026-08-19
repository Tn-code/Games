import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export function UserProfile({ onClose }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    bio: '',
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData({
            displayName: data.displayName || user.displayName || '',
            phone: data.phone || '',
            bio: data.bio || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        showToast('❌ No user logged in', 'error');
        setLoading(false);
        return;
      }

      // 1. Update Firebase Auth user display name
      try {
        await updateProfile(user, { 
          displayName: formData.displayName 
        });
        console.log('✅ Auth display name updated');
      } catch (authError) {
        console.error('Auth update error:', authError);
        // Continue with Firestore update even if Auth fails
      }

      // 2. Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        bio: formData.bio,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Firestore user updated');

      // 3. Refresh user object
      // Force a reload of the user data
      await user.reload();
      
      showToast('✅ Profile updated successfully!', 'success');
      setIsEditing(false);
      
      // 4. Reload user data from Firestore
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setUserData(updatedDoc.data());
        setFormData({
          displayName: updatedDoc.data().displayName || formData.displayName,
          phone: updatedDoc.data().phone || '',
          bio: updatedDoc.data().bio || '',
        });
      }
      
      // 5. Reload the page to update all components
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(`❌ Error: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    showToast('👋 Logged out successfully', 'info');
    if (onClose) onClose();
  };

  // Get current user data from Firestore or use defaults
  const currentUser = userData || {};

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i className="fas fa-user-circle text-purple-600"></i>
          My Profile
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
            {formData.displayName?.[0] || user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{formData.displayName || user?.displayName || 'User'}</h3>
          <p className="text-gray-500">{user?.email}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${currentUser.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {currentUser.isAdmin ? '👑 Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+216 12 345 678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Display Name</p>
              <p className="font-medium text-gray-800">{formData.displayName || user?.displayName || 'Not set'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{formData.phone || 'Not set'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-800">{currentUser.isAdmin ? '👑 Admin' : '👤 User'}</p>
            </div>
          </div>
          {formData.bio && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="font-medium text-gray-800">{formData.bio}</p>
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all flex items-center gap-2">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
