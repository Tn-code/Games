import React from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function UserManagement() {
  const { data: users, loading } = useFirestore('users');
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"><i className="fas fa-users text-blue-600"></i>User Management</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 border-b border-gray-100">
              <div><p className="font-medium text-gray-800">{user.email || user.displayName || 'User'}</p></div>
              <span className="text-sm text-gray-500">ID: {user.uid?.substring(0, 8)}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
