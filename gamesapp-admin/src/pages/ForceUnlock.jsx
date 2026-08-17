import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ForceUnlock() {
  const { data: users, loading: usersLoading, fetchData } = useFirestore('users');
  const { data: requests, loading: requestsLoading } = useFirestore('premiumRequests');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const forceUnlock = async () => {
    setProcessing(true);
    setMessage({ type: '', text: '' });
    setResults([]);

    try {
      console.log('🔧 Force unlocking...');
      
      const approvedRequests = requests.filter(r => r.status === 'approved');
      let count = 0;
      const resultItems = [];

      for (const request of approvedRequests) {
        console.log(`📝 Processing: ${request.itemName} for ${request.userEmail}`);
        
        // Find user by email (more reliable)
        const user = users.find(u => u.email === request.userEmail);
        
        if (user) {
          console.log(`✅ Found user: ${user.email} (${user.uid})`);
          
          // Get current unlocked content
          const userRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          const unlocked = userData?.unlockedContent || [];
          
          const alreadyUnlocked = unlocked.some(item => 
            item.id === request.itemId && item.type === request.itemType
          );

          if (!alreadyUnlocked) {
            const newContent = {
              id: request.itemId,
              name: request.itemName,
              type: request.itemType,
              grantedAt: new Date().toISOString(),
              grantedBy: 'admin',
              paid: true
            };

            await updateDoc(userRef, {
              unlockedContent: [...unlocked, newContent]
            });
            
            count++;
            resultItems.push(`✅ ${request.itemName} → ${user.email}`);
            console.log(`✅ Added: ${request.itemName} to ${user.email}`);
          } else {
            resultItems.push(`⏭️ ${request.itemName} → ${user.email} (already unlocked)`);
          }
        } else {
          resultItems.push(`❌ ${request.itemName} → User not found (${request.userEmail})`);
          console.log(`❌ User not found: ${request.userEmail}`);
        }
      }

      await fetchData();
      setResults(resultItems);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Force unlocked ${count} items!` 
      });
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
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-4xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Force Unlock</h2>
            <p className="text-gray-500 mt-2">
              Force unlock approved content for users (by email)
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
            onClick={forceUnlock}
            disabled={processing}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Force Unlocking...
              </>
            ) : (
              <>
                <i className="fas fa-bolt mr-2"></i>
                Force Unlock All
              </>
            )}
          </button>

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

          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-800">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              This will force unlock all approved content by matching user email.
              Make sure the user emails match exactly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
