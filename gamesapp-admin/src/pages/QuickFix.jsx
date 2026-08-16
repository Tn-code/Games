import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function QuickFix() {
  const { data: users, loading: usersLoading, fetchData } = useFirestore('users');
  const { data: requests, loading: requestsLoading } = useFirestore('premiumRequests');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processing, setProcessing] = useState(false);

  const fixAllApproved = async () => {
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔧 Starting fix...');
      console.log('📊 Total requests:', requests.length);
      
      const approvedRequests = requests.filter(r => r.status === 'approved');
      console.log('📊 Approved requests:', approvedRequests.length);
      
      let count = 0;
      let skipped = 0;

      for (const request of approvedRequests) {
        console.log(`\n📝 Processing: ${request.itemName} for ${request.userEmail}`);
        
        const user = users.find(u => u.uid === request.userId);
        if (user) {
          console.log('✅ User found:', user.email);
          
          const unlocked = user.unlockedContent || [];
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

            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
              unlockedContent: [...unlocked, newContent]
            });
            count++;
            console.log(`✅ Added: ${request.itemName} to ${user.email}`);
          } else {
            skipped++;
            console.log(`ℹ️ Already unlocked: ${request.itemName}`);
          }
        } else {
          console.log(`❌ User not found: ${request.userId}`);
        }
      }

      await fetchData();
      
      setMessage({ 
        type: 'success', 
        text: `✅ Fixed ${count} items for users! (${skipped} already unlocked)` 
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
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-tools text-4xl text-yellow-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Fix</h2>
            <p className="text-gray-500 mt-2">
              Fix approved premium requests that didn't unlock content
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
              <p className="text-sm text-gray-600">Users with Unlocked Content</p>
            </div>
          </div>

          <button
            onClick={fixAllApproved}
            disabled={processing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fixing...
              </>
            ) : (
              <>
                <i className="fas fa-wrench"></i>
                Fix All Approved Requests
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-2"></i>
              This will add all approved premium content to users' unlockedContent.
              Run this once if users can't see their approved content.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Tip:</strong> After running this fix, users should refresh their dashboard to see the unlocked content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
