import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AdminPremiumRequests() {
  const { user: currentUser } = useAuth();
  const { data: requests, loading, updateItem, deleteItem } = useFirestore('premiumRequests');
  const { data: users, loading: usersLoading, updateItem: updateUser } = useFirestore('users');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('pending');

  if (loading || usersLoading) return <LoadingSpinner />;

  const filteredRequests = requests.filter(r => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const approveRequest = async (request) => {
    if (!window.confirm(`Approve premium access for ${request.itemName}?`)) return;

    try {
      await updateItem(request.id, { 
        status: 'approved', 
        adminApproved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.email
      });

      const user = users.find(u => u.uid === request.userId);
      if (user) {
        const unlocked = user.unlockedContent || [];
        if (!unlocked.some(item => item.id === request.itemId && item.type === request.itemType)) {
          await updateUser(user.id, {
            unlockedContent: [
              ...unlocked,
              {
                id: request.itemId,
                name: request.itemName,
                type: request.itemType,
                grantedAt: new Date().toISOString(),
                grantedBy: currentUser.email,
                paid: true
              }
            ]
          });
        }
      }

      setMessage({ type: 'success', text: `✅ Premium access approved for ${request.itemName}` });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
  };

  const rejectRequest = async (request) => {
    if (!window.confirm(`Reject premium access for ${request.itemName}?`)) return;

    try {
      await updateItem(request.id, { 
        status: 'rejected', 
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.email
      });
      setMessage({ type: 'success', text: `❌ Request rejected for ${request.itemName}` });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels = {
      pending: '⏳ Pending',
      approved: '✅ Approved',
      rejected: '❌ Rejected'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="fas fa-gem text-purple-600"></i>
              Premium Requests
            </h2>
            <p className="text-gray-500 mt-1">Manage user requests for premium content</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
              Pending: {requests.filter(r => r.status === 'pending').length}
            </span>
          </div>
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

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600">No requests found</h3>
            <p className="text-gray-400 mt-2">All premium requests will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{request.fullName || request.userName || request.userEmail}</p>
                          <p className="text-xs text-gray-500">{request.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-blue-600">
                            <i className="fas fa-phone mr-1"></i>
                            {request.phoneNumber || 'No phone'}
                          </p>
                          {request.notes && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{request.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{request.itemName}</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {request.itemType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-purple-600">{request.price} DT</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveRequest(request)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
                            >
                              <i className="fas fa-check mr-1"></i> Approve
                            </button>
                            <button
                              onClick={() => rejectRequest(request)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                            >
                              <i className="fas fa-times mr-1"></i> Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
