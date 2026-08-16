// This script uses Firebase Admin SDK to sync all users from Auth to Firestore
// Run with: node sync-users-script.js

const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize with service account
// You need to put your service account JSON file here
try {
  // Try to load service account from file
  const serviceAccount = require('./gamesapp-33a5f-firebase-adminsdk-fbsvc-6aaf49b657.json');
  
  initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Service account file not found. Using default credentials...');
  initializeApp();
}

const db = getFirestore();
const auth = admin.auth();

async function syncUsers() {
  console.log('🔄 Starting user sync...');
  
  try {
    // Get all users from Firebase Auth
    const listUsersResult = await auth.listUsers();
    
    console.log(`📊 Found ${listUsersResult.users.length} users in Authentication`);
    
    let addedCount = 0;
    let updatedCount = 0;
    
    for (const user of listUsersResult.users) {
      try {
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || '',
          createdAt: user.metadata?.creationTime || new Date().toISOString(),
          lastLogin: user.metadata?.lastSignInTime || new Date().toISOString(),
          isAdmin: user.email === 'houssinetrabelsi6@gmail.com',
          providers: user.providerData?.map(p => p.providerId) || [],
          purchases: [],
          unlockedContent: []
        };
        
        if (!userDoc.exists) {
          await userRef.set(userData);
          addedCount++;
          console.log(`✅ Added user: ${user.email}`);
        } else {
          // Update existing user
          await userRef.update({
            ...userData,
            lastSync: new Date().toISOString()
          });
          updatedCount++;
          console.log(`🔄 Updated user: ${user.email}`);
        }
        
      } catch (error) {
        console.error(`❌ Error syncing user ${user.email}:`, error.message);
      }
    }
    
    console.log('\n📊 Sync Summary:');
    console.log(`✅ Added: ${addedCount} users`);
    console.log(`🔄 Updated: ${updatedCount} users`);
    console.log(`📊 Total: ${listUsersResult.users.length} users`);
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

// Run the sync
syncUsers();
