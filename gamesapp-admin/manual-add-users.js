const admin = require('firebase-admin');

// Initialize
try {
  const serviceAccount = require('./gamesapp-33a5f-firebase-adminsdk-fbsvc-6aaf49b657.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Service account file not found. Please download it from Firebase Console.');
  process.exit(1);
}

const db = admin.firestore();

// Add your users manually
const users = [
  {
    uid: 'Kj2DReq33cOD...', // Replace with actual UID from Firebase Console
    email: 'tvh88643@...',
    displayName: 'User 1',
    photoURL: '',
    isAdmin: false,
    providers: ['google.com']
  },
  // Add more users here
];

async function addUsers() {
  for (const user of users) {
    try {
      const userRef = db.collection('users').doc(user.uid);
      await userRef.set({
        ...user,
        createdAt: new Date().toISOString(),
        purchases: [],
        unlockedContent: []
      });
      console.log(`✅ Added: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

addUsers();
