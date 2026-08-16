import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

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
    if (!window.confirm(`Approve premium access for "${request.itemName}"?`)) return;
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('📝 Approving request for:', request.itemName);
      console.log('📝 User ID:', request.userId);
      
      // 1. Update request status
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'approved',
        adminApproved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.email
      });
      console.log('✅ Request updated to approved');

      // 2. Find the user in Firestore
      const user = users.find(u => u.uid === request.userId);
      
      if (user) {
        console.log('✅ User found in Firestore:', user.email);
        
        // 3. Get the user's current unlocked content
        const userRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const unlocked = userData?.unlockedContent || [];
        
        console.log('📊 Current unlocked content:', unlocked);
        
        // 4. Check if already unlocked
        const alreadyUnlocked = unlocked.some(item => 
          item.id === request.itemId && item.type === request.itemType
        );
        
        if (!alreadyUnlocked) {
          // 5. Add new content
          const newContent = {
            id: request.itemId,
            name: request.itemName,
            type: request.itemType,
            grantedAt: new Date().toISOString(),
            grantedBy: currentUser.email,
            paid: true
          };
          
          const updatedUnlocked = [...unlocked, newContent];
          console.log('📝 Adding new content:', newContent);
          console.log('📝 Updated unlocked content:', updatedUnlocked);
          
          // 6. Update user's unlocked content - DIRECT UPDATE
          await updateDoc(userRef, {
            unlockedContent: updatedUnlocked,
            lastUpdated: new Date().toISOString()
          });
          
          console.log('✅ Content added to user library:', request.itemName);
          
          setMessage({ 
            type: 'success', 
            text: `✅ Premium access granted for "${request.itemName}" to ${user.email}` 
          });
        } else {
          console.log('ℹ️ User already has this content');
          setMessage({ 
            type: 'info', 
            text: `ℹ️ User already has access to "${request.itemName}"` 
          });
        }
      } else {
        console.error('❌ User not found:', request.userId);
        setMessage({ 
          type: 'error', 
          text: `❌ User not found. Please sync users first.` 
        });
      }

      // 7. Refresh data
      await fetchData();
      await fetchUsers();
      
    } catch (error) {
      console.error('❌ Error approving request:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setProcessing(false);
  };

  const rejectRequest = async (request) => {
    if (!window.confirm(`Reject premium access for "${request.itemName}"?`)) return;
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.email
      });
      console.log('✅ Request updated to rejected');

      await fetchData();
      await fetchUsers();

      setMessage({ type: 'success', text: `❌ Request rejected for "${request.itemName}"` });
      
    } catch (error) {
      console.error('❌ Error rejecting request:', error);
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
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium">
              Approved: {requests.filter(r => r.status === 'approved').length}
            </span>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : message.type === 'info'
              ? 'bg-blue-50 border border-blue-200 text-blue-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}`}></i>
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
                            <p className="text-xs text-gray-400 mt-1">{request.notes}</p>
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
                              disabled={processing}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                            >
                              <i className="fas fa-check mr-1"></i> Approve
                            </button>
                            <button
                              onClick={() => rejectRequest(request)}
                              disabled={processing}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                              <i className="fas fa-times mr-1"></i> Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                            {request.approvedAt && (
                              <span className="block text-xs text-gray-400">
                                {new Date(request.approvedAt).toLocaleDateString()}
                              </span>
                            )}
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
