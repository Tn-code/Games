const admin = require('firebase-admin');
const fs = require('fs');

// Find the service account file automatically
const files = fs.readdirSync('.').filter(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));

if (files.length === 0) {
  console.error('❌ No service account file found!');
  console.log('Please download it from:');
  console.log('https://console.firebase.google.com/project/gamesapp-33a5f/settings/serviceaccounts/adminsdk');
  process.exit(1);
}

console.log(`📁 Using service account: ${files[0]}`);
const serviceAccount = require(`./${files[0]}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function syncAllUsers() {
  console.log('🔄 Starting full user sync...');
  
  try {
    // Get ALL users from Firebase Authentication
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users;
    
    console.log(`📊 Found ${users.length} users in Firebase Authentication`);
    
    let added = 0;
    let updated = 0;
    
    for (const user of users) {
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
        providers: user.providerData?.map(p => p.providerId) || ['password'],
        purchases: [],
        unlockedContent: []
      };
      
      if (!userDoc.exists) {
        await userRef.set(userData);
        added++;
        console.log(`✅ Added: ${user.email} (${user.uid})`);
      } else {
        await userRef.update({
          ...userData,
          lastSync: new Date().toISOString()
        });
        updated++;
        console.log(`🔄 Updated: ${user.email}`);
      }
    }
    
    console.log('\n📊 Sync Summary:');
    console.log(`✅ Added: ${added} users`);
    console.log(`🔄 Updated: ${updated} users`);
    console.log(`📊 Total: ${users.length} users in Firestore`);
    
    // Verify the data
    const snapshot = await db.collection('users').get();
    console.log(`\n📋 Firestore now has ${snapshot.size} users:`);
    snapshot.forEach(doc => {
      console.log(`  - ${doc.data().email} (${doc.data().isAdmin ? 'Admin' : 'User'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

syncAllUsers();
