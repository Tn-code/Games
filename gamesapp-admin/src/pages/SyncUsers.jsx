import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function SyncUsers() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [syncedCount, setSyncedCount] = useState(0);

  const syncUsers = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    setSyncedCount(0);

    try {
      // Get all users from Firebase Auth
      const users = await auth.getUsers();
      
      let count = 0;
      for (const user of users.users) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // Create user in Firestore
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              isAdmin: user.email === 'houssinetrabelsi6@gmail.com',
              purchases: [],
              unlockedContent: []
            });
            count++;
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }

      setSyncedCount(count);
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully synced ${count} users to Firestore!` 
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error syncing users: ${error.message}` 
      });
    }
    setLoading(false);
  };

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
              Import all users from Firebase Authentication to Firestore
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {message.text}
            </div>
          )}

          {syncedCount > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-blue-700">
                <i className="fas fa-users mr-2"></i>
                {syncedCount} new users added to Firestore
              </p>
            </div>
          )}

          <button
            onClick={syncUsers}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <i className="fas fa-sync"></i>
                Sync Users Now
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-2"></i>
              This will import all users from Firebase Authentication to Firestore.
              Users will be available in the User Management section after syncing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
