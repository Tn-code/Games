import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function FixUnlock() {
  const { data: users, loading: usersLoading, fetchData } = useFirestore('users');
  const { data: requests, loading: requestsLoading } = useFirestore('premiumRequests');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [totalFixed, setTotalFixed] = useState(0);

  const fixAll = async () => {
    setProcessing(true);
    setMessage({ type: '', text: '' });
    setResults([]);
    setTotalFixed(0);

    try {
      // Get all approved requests
      const approvedRequests = requests.filter(r => r.status === 'approved');
      
      if (approvedRequests.length === 0) {
        setMessage({ type: 'info', text: 'ℹ️ No approved requests to fix' });
        setProcessing(false);
        return;
      }

      let fixed = 0;
      const resultItems = [];

      for (const request of approvedRequests) {
        // Find user by email
        const user = users.find(u => u.email === request.userEmail);
        
        if (user) {
          // Get the user document
          const userRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          const unlocked = userData?.unlockedContent || [];
          
          // Check if already unlocked
          const alreadyUnlocked = unlocked.some(item => 
            item.id === request.itemId && item.type === request.itemType
          );

          if (!alreadyUnlocked) {
            // Add new content
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
            
            fixed++;
            resultItems.push(`✅ ${request.itemName} → ${user.email}`);
          } else {
            resultItems.push(`⏭️ Already unlocked: ${request.itemName} → ${user.email}`);
          }
        } else {
          resultItems.push(`❌ User not found: ${request.userEmail}`);
        }
      }

      await fetchData();
      setResults(resultItems);
      setTotalFixed(fixed);
      
      if (fixed > 0) {
        setMessage({ 
          type: 'success', 
          text: `✅ Successfully unlocked ${fixed} items!` 
        });
      } else {
        setMessage({ 
          type: 'info', 
          text: `ℹ️ All ${approvedRequests.length} items were already unlocked` 
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setProcessing(false);
  };

  if (usersLoading || requestsLoading) return <LoadingSpinner />;

  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const usersWithContent = users.filter(u => u.unlockedContent?.length > 0).length;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-unlock text-4xl text-blue-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Fix Unlock</h2>
            <p className="text-gray-500 mt-2">
              Unlock all approved premium content for users
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

          {totalFixed > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl text-center border-2 border-green-200">
              <p className="text-2xl font-bold text-green-600">{totalFixed}</p>
              <p className="text-sm text-gray-600">Items unlocked successfully!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600">{approvedCount}</p>
              <p className="text-sm text-gray-600">Approved Requests</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">{usersWithContent}</p>
              <p className="text-sm text-gray-600">Users with Content</p>
            </div>
          </div>

          <button
            onClick={fixAll}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Unlocking...
              </>
            ) : (
              <>
                <i className="fas fa-unlock mr-2"></i>
                Unlock All Now
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-2"></i>
              This will unlock all approved premium content for users.
              Users will see the content immediately after refreshing.
            </p>
          </div>

          {results.length > 0 && (
            <div className="mt-6 max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-gray-700 mb-2">Results:</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Tip:</strong> After clicking "Unlock All Now", users should refresh their dashboard to see the unlocked content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
