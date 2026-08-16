import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { data: users, loading, deleteItem } = useFirestore('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <LoadingSpinner />;

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.isAdmin === true).length;
  const regularUsers = totalUsers - adminUsers;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="fas fa-users text-blue-600"></i>
              User Management
            </h2>
            <p className="text-gray-500 mt-1">Manage all registered users</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
              Total: {totalUsers}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium">
              Users: {regularUsers}
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
              Admins: {adminUsers}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600">No users found</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try a different search term' : 
                'Users will appear here after they register or after syncing'}
            </p>
            {totalUsers === 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">To sync existing users:</p>
                <div className="flex justify-center gap-4">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    Sign in with a user account
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    Or use the Sync Users feature
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.displayName || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">ID: {user.uid?.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{user.email || 'No email'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isAdmin ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            <i className="fas fa-crown mr-1"></i> Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <i className="fas fa-user mr-1"></i> User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                          >
                            <i className="fas fa-eye mr-1"></i> View
                          </button>
                          {user.uid !== currentUser?.uid && (
                            <button 
                              onClick={() => {
                                if (window.confirm(`Delete user ${user.email}?`)) {
                                  deleteItem(user.id);
                                }
                              }}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                            >
                              <i className="fas fa-trash mr-1"></i> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                  <p className="text-sm text-gray-500">User information</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                    {selectedUser.displayName?.[0] || selectedUser.email?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedUser.displayName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">{selectedUser.isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="font-medium text-gray-800 text-sm break-all">{selectedUser.uid}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
