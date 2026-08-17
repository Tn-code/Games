import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ForceUnlockNow() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [results, setResults] = useState([]);

  const forceUnlock = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults([]);

    try {
      console.log('🔧 Starting force unlock...');

      // 1. Get all approved requests
      const requestsQuery = query(
        collection(db, 'premiumRequests'),
        where('status', '==', 'approved')
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`📊 Found ${requests.length} approved requests`);

      // 2. Get all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = {};
      usersSnapshot.forEach(doc => {
        users[doc.data().email] = { id: doc.id, ...doc.data() };
      });
      console.log(`📊 Found ${Object.keys(users).length} users`);

      let unlocked = 0;
      let alreadyUnlocked = 0;
      let notFound = 0;
      const resultItems = [];

      // 3. Process each request
      for (const request of requests) {
        console.log(`\n📝 Processing: ${request.itemName} for ${request.userEmail}`);
        
        const user = users[request.userEmail];
        if (!user) {
          notFound++;
          resultItems.push(`❌ User not found: ${request.userEmail}`);
          console.log(`❌ User not found: ${request.userEmail}`);
          continue;
        }

        console.log(`✅ Found user: ${user.email} (doc: ${user.id})`);

        // Get current unlocked content
        const currentUnlocked = user.unlockedContent || [];
        console.log(`📊 Current unlocked: ${currentUnlocked.length} items`);

        // Check if already unlocked
        const exists = currentUnlocked.some(item => 
          item.id === request.itemId && item.type === request.itemType
        );

        if (exists) {
          alreadyUnlocked++;
          resultItems.push(`⏭️ Already unlocked: ${request.itemName} → ${user.email}`);
          console.log(`⏭️ Already unlocked: ${request.itemName}`);
          continue;
        }

        // Add new content
        const newContent = {
          id: request.itemId,
          name: request.itemName,
          type: request.itemType || 'story',
          grantedAt: new Date().toISOString(),
          grantedBy: 'admin',
          paid: true
        };

        const updatedUnlocked = [...currentUnlocked, newContent];
        console.log(`📝 Adding: ${newContent.name}`);
        console.log(`📊 New unlocked count: ${updatedUnlocked.length}`);

        // Update Firestore directly
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          unlockedContent: updatedUnlocked
        });

        unlocked++;
        resultItems.push(`✅ ${request.itemName} → ${user.email} (${updatedUnlocked.length} items now)`);
        console.log(`✅ Added: ${request.itemName} to ${user.email}`);
      }

      setResults(resultItems);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Done! ${unlocked} new, ${alreadyUnlocked} already, ${notFound} not found` 
      });

      console.log('\n📊 Final summary:');
      console.log(`   ✅ Newly unlocked: ${unlocked}`);
      console.log(`   ⏭️ Already unlocked: ${alreadyUnlocked}`);
      console.log(`   ❌ Not found: ${notFound}`);

    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-4xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Force Unlock Now</h2>
            <p className="text-gray-500 mt-2">
              Directly unlock all approved premium content
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

          <button
            onClick={forceUnlock}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Unlocking...
              </>
            ) : (
              <>
                <i className="fas fa-bolt mr-2"></i>
                Force Unlock All Now
              </>
            )}
          </button>

          {results.length > 0 && (
            <div className="mt-6 max-h-80 overflow-y-auto">
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
              <strong>This will directly update Firestore!</strong> 
              Users will see unlocked content immediately after refreshing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
