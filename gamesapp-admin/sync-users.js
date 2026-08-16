const admin = require('firebase-admin');

// Initialize with service account
const serviceAccount = require('./gamesapp-33a5f-firebase-adminsdk-fbsvc-6aaf49b657.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function syncUsers() {
  console.log('🔄 Syncing users...');
  try {
    const result = await auth.listUsers();
    console.log(`📊 Found ${result.users.length} users`);
    
    for (const user of result.users) {
      await db.collection('users').doc(user.uid).set({
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
      }, { merge: true });
      console.log(`✅ Synced: ${user.email}`);
    }
    console.log(`✅ Complete! ${result.users.length} users synced`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

syncUsers();
