import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function SyncUsers() {
  const { user: currentUser } = useAuth();
  const { data: users, loading, addItem, fetchData } = useFirestore('users');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check if user exists in Firestore
  const userExists = users.some(u => u.uid === currentUser?.uid);

  const handleSync = async () => {
    setSyncing(true);
    setMessage({ type: '', text: '' });

    try {
      // If current user not in Firestore, add them
      if (currentUser && !userExists) {
        await addItem({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          photoURL: currentUser.photoURL || '',
          createdAt: new Date().toISOString(),
          isAdmin: currentUser.email === 'houssinetrabelsi6@gmail.com',
          purchases: [],
          unlockedContent: []
        });
        
        setMessage({ 
          type: 'success', 
          text: '✅ Current user synced successfully!' 
        });
      } else {
        setMessage({ 
          type: 'info', 
          text: 'ℹ️ Current user already exists in Firestore' 
        });
      }

      // Refresh data
      await fetchData();

    } catch (error) {
      console.error('Sync error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message}` 
      });
    }
    setSyncing(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-sync text-4xl text-blue-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sync Users</h2>
            <p className="text-gray-500 mt-2">
              Sync current user to Firestore
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : message.type === 'info'
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <i className={`fas ${
                message.type === 'success' ? 'fa-check-circle' :
                message.type === 'info' ? 'fa-info-circle' :
                'fa-exclamation-circle'
              }`}></i>
              {message.text}
            </div>
          )}

          {/* Current User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-700 mb-2">Current User:</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{currentUser?.displayName || 'No name'}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <p className="text-xs text-gray-400">UID: {currentUser?.uid?.substring(0, 12)}...</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users in Firestore</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">
                {userExists ? '✅' : '❌'}
              </p>
              <p className="text-sm text-gray-600">Current User in Firestore</p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {syncing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <i className="fas fa-sync"></i>
                {userExists ? 'Re-sync User' : 'Sync User Now'}
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-2"></i>
              This will sync the currently logged-in user to Firestore.
              Users will be available in User Management after syncing.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Tip:</strong> When new users sign in, they will be automatically added to Firestore.
              Use this tool to sync existing users from Firebase Authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
