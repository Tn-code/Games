const admin = require('firebase-admin');
const fs = require('fs');

// Find the service account file
const files = fs.readdirSync('.').filter(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));

if (files.length === 0) {
  console.error('❌ No service account file found!');
  process.exit(1);
}

console.log(`📁 Using: ${files[0]}`);
const serviceAccount = require(`./${files[0]}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Users from your Firebase Console
const users = [
  {
    uid: 'qXhAxMbWsNYU...', // Replace with actual UID from Firebase Console
    email: 'houssinetrabelsi6@gmail.com',
    displayName: 'Houssine Trabelsi',
    isAdmin: true
  },
  {
    uid: 'vOrTsO1ALMbE...', // Replace with actual UID from Firebase Console
    email: 'utiqanoooo...',
    displayName: 'User 2',
    isAdmin: false
  }
];

async function addUsers() {
  console.log('📝 Adding users...');
  
  let count = 0;
  for (const user of users) {
    try {
      const userRef = db.collection('users').doc(user.uid);
      await userRef.set({
        ...user,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        purchases: [],
        unlockedContent: []
      }, { merge: true });
      count++;
      console.log(`✅ Added: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Added ${count} users to Firestore`);
}

addUsers();
