const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
try {
  const serviceAccount = require('./gamesapp-33a5f-firebase-adminsdk-fbsvc-6aaf49b657.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Service account file not found. Using default credentials...');
  admin.initializeApp();
}

const db = admin.firestore();

// Read users from JSON file
function importUsers() {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    const users = JSON.parse(data);
    
    console.log(`📊 Found ${users.users.length} users`);
    
    for (const user of users.users) {
      const userRef = db.collection('users').doc(user.uid);
      userRef.set({
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
      }).then(() => {
        console.log(`✅ Imported: ${user.email}`);
      }).catch((error) => {
        console.error(`❌ Error importing ${user.email}:`, error.message);
      });
    }
    
    console.log('✅ Import complete!');
    
  } catch (error) {
    console.error('❌ Error reading users.json:', error);
  }
}

importUsers();
