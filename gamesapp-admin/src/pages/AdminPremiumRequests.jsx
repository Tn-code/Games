import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export function AdminPremiumRequests() {
  const { user: currentUser } = useAuth();
  const { data: requests, loading, fetchData } = useFirestore('premiumRequests');
  const { data: users, loading: usersLoading, fetchData: fetchUsers } = useFirestore('users');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState(false);

  if (loading || usersLoading) return <LoadingSpinner />;

  const filteredRequests = requests.filter(r => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const approveRequest = async (request) => {
    if (!window.confirm(`Approve "${request.itemName}" for ${request.userEmail}?`)) return;
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Update request status
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.email
      });

      // 2. Find user and update unlockedContent
      const user = users.find(u => u.email === request.userEmail);
      if (user) {
        const userRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const unlocked = userData?.unlockedContent || [];
        
        // Check if already unlocked
        const alreadyUnlocked = unlocked.some(item => item.id === request.itemId);
        
        if (!alreadyUnlocked) {
          const newContent = {
            id: request.itemId,
            name: request.itemName,
            type: request.itemType || 'story',
            grantedAt: new Date().toISOString(),
            grantedBy: 'admin',
            paid: true
          };
          
          await updateDoc(userRef, {
            unlockedContent: [...unlocked, newContent]
          });
          console.log(`✅ Unlocked ${request.itemName} for ${user.email}`);
          setMessage({ type: 'success', text: `✅ "${request.itemName}" unlocked for ${user.email}` });
        } else {
          setMessage({ type: 'info', text: `ℹ️ "${request.itemName}" already unlocked for ${user.email}` });
        }
      } else {
        setMessage({ type: 'error', text: `❌ User ${request.userEmail} not found` });
      }

      await fetchData();
      await fetchUsers();
      
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setProcessing(false);
  };

  const rejectRequest = async (request) => {
    if (!window.confirm(`Reject "${request.itemName}"?`)) return;
    setProcessing(true);

    try {
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.email
      });
      await fetchData();
      setMessage({ type: 'success', text: `❌ Rejected "${request.itemName}"` });
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setProcessing(false);
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
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
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
            <p className="text-gray-500 mt-1">Approve or reject user requests</p>
          </div>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
            Pending: {requests.filter(r => r.status === 'pending').length}
          </span>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' :
            message.type === 'info' ? 'bg-blue-50 text-blue-700' :
            'bg-red-50 text-red-700'
          }`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && requests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No {filter} requests</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{req.userName || req.userEmail}</p>
                          <p className="text-xs text-gray-500">{req.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{req.itemName}</p>
                        <span className="text-xs text-gray-500 capitalize">{req.itemType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-blue-600">{req.phoneNumber || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-purple-600">{req.price} DT</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-6 py-4">
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveRequest(req)}
                              disabled={processing}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => rejectRequest(req)}
                              disabled={processing}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {req.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            {req.status === 'approved' ? '✅ Done' : '❌ Rejected'}
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
