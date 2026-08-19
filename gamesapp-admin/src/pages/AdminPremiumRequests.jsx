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
  const { data: stories, loading: storiesLoading } = useFirestore('stories');
  const { data: videos, loading: videosLoading } = useFirestore('videos');
  const { data: quizzes, loading: quizzesLoading } = useFirestore('quizzes');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState(false);

  if (loading || usersLoading || storiesLoading || videosLoading || quizzesLoading) {
    return <LoadingSpinner />;
  }

  const filteredRequests = requests.filter(r => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const approveRequest = async (request) => {
    if (!window.confirm(`Approuver "${request.itemName}" pour ${request.userEmail}?`)) return;
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Update request status
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'approved',
        adminApproved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.email
      });

      // 2. Find user
      const user = users.find(u => u.email === request.userEmail);
      if (user) {
        const userRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const unlocked = userData?.unlockedContent || [];
        
        // For subscription - UNLOCK ALL PREMIUM CONTENT
        if (request.subscription) {
          // Get all premium content IDs
          const premiumStories = stories.filter(s => s.type === 'premium').map(s => ({
            id: s.id,
            name: s.name,
            type: 'story'
          }));
          
          const premiumVideos = videos.filter(v => v.type === 'premium').map(v => ({
            id: v.id,
            name: v.title,
            type: 'video'
          }));
          
          const premiumQuizzes = quizzes.filter(q => q.type === 'premium').map(q => ({
            id: q.id,
            name: q.title,
            type: 'quiz'
          }));
          
          // Combine all premium content
          const allPremiumContent = [...premiumStories, ...premiumVideos, ...premiumQuizzes];
          
          // Filter out already unlocked content
          const unlockedIds = unlocked.map(item => item.id);
          const newContent = allPremiumContent.filter(item => !unlockedIds.includes(item.id));
          
          // Add subscription flag
          const subscriptionItem = {
            id: 'subscription',
            name: 'Abonnement Premium (Tout accès)',
            type: 'subscription',
            grantedAt: new Date().toISOString(),
            grantedBy: currentUser.email,
            paid: true
          };
          
          // Update user with ALL premium content + subscription flag
          await updateDoc(userRef, {
            isSubscribed: true,
            subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            unlockedContent: [...unlocked, ...newContent, subscriptionItem]
          });
          
          setMessage({ 
            type: 'success', 
            text: `✅ Abonnement premium activé pour ${user.email} (${newContent.length} contenus débloqués)` 
          });
        } else {
          // Single item unlock
          const alreadyUnlocked = unlocked.some(item => item.id === request.itemId);
          if (!alreadyUnlocked) {
            const newContent = {
              id: request.itemId,
              name: request.itemName,
              type: request.itemType,
              grantedAt: new Date().toISOString(),
              grantedBy: currentUser.email,
              paid: true
            };
            await updateDoc(userRef, {
              unlockedContent: [...unlocked, newContent]
            });
            setMessage({ type: 'success', text: `✅ "${request.itemName}" débloqué pour ${user.email}` });
          } else {
            setMessage({ type: 'info', text: `ℹ️ "${request.itemName}" déjà débloqué pour ${user.email}` });
          }
        }
      } else {
        setMessage({ type: 'error', text: `❌ Utilisateur non trouvé: ${request.userEmail}` });
      }

      await fetchData();
      await fetchUsers();
      
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ type: 'error', text: `❌ Erreur: ${error.message}` });
    }
    setProcessing(false);
  };

  const rejectRequest = async (request) => {
    if (!window.confirm(`Rejeter "${request.itemName}"?`)) return;
    setProcessing(true);

    try {
      const requestRef = doc(db, 'premiumRequests', request.id);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.email
      });
      await fetchData();
      setMessage({ type: 'success', text: `❌ Demande rejetée: "${request.itemName}"` });
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Erreur: ${error.message}` });
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
      pending: '⏳ En attente',
      approved: '✅ Approuvé',
      rejected: '❌ Rejeté'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getRequestType = (request) => {
    if (request.subscription) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">⭐ Abonnement</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{request.itemType}</span>;
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="fas fa-gem text-purple-600"></i>
              Demandes Premium
            </h2>
            <p className="text-gray-500 mt-1">Gérer les demandes d'accès premium</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
              En attente: {requests.filter(r => r.status === 'pending').length}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium">
              Approuvées: {requests.filter(r => r.status === 'approved').length}
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

        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvées' : 'Rejetées'}
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
            <p className="text-gray-500">Aucune demande {filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvée' : 'rejetée'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contenu</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{req.fullName || req.userName || req.userEmail}</p>
                          <p className="text-xs text-gray-500">{req.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-blue-600">{req.phoneNumber || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{req.itemName}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getRequestType(req)}
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
                              ✅ Approuver
                            </button>
                            <button
                              onClick={() => rejectRequest(req)}
                              disabled={processing}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                              ❌ Rejeter
                            </button>
                          </div>
                        )}
                        {req.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            {req.status === 'approved' ? '✅ Fait' : '❌ Rejeté'}
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
