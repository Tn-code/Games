const admin = require('firebase-admin');
const fs = require('fs');

// Find service account
const files = fs.readdirSync('.').filter(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));
if (files.length === 0) {
  console.error('❌ Service account not found!');
  process.exit(1);
}

const serviceAccount = require('./' + files[0]);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixUnlockedContent() {
  console.log('🔧 Fixing unlocked content for users...');
  
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Found ${usersSnapshot.size} users`);
    
    // Get all premium requests that are approved
    const requestsSnapshot = await db.collection('premiumRequests')
      .where('status', '==', 'approved')
      .get();
    
    console.log(`📊 Found ${requestsSnapshot.size} approved requests`);
    
    for (const requestDoc of requestsSnapshot.docs) {
      const request = requestDoc.data();
      console.log(`\n📝 Processing request: ${request.itemName} for ${request.userEmail}`);
      
      // Find the user
      const userDoc = await db.collection('users')
        .where('uid', '==', request.userId)
        .get();
      
      if (userDoc.empty) {
        console.log(`❌ User not found: ${request.userId}`);
        continue;
      }
      
      const user = userDoc.docs[0];
      const userData = user.data();
      const unlocked = userData.unlockedContent || [];
      
      // Check if already unlocked
      const alreadyUnlocked = unlocked.some(item => 
        item.id === request.itemId && item.type === request.itemType
      );
      
      if (!alreadyUnlocked) {
        // Add new content
        const newContent = {
          id: request.itemId,
          name: request.itemName,
          type: request.itemType,
          grantedAt: new Date().toISOString(),
          grantedBy: 'admin',
          paid: true
        };
        
        // Update user
        await user.ref.update({
          unlockedContent: [...unlocked, newContent]
        });
        
        console.log(`✅ Added: ${request.itemName} to ${userData.email}`);
      } else {
        console.log(`ℹ️ Already unlocked: ${request.itemName}`);
      }
    }
    
    console.log('\n✅ Fix complete!');
    
    // Verify
    const finalSnapshot = await db.collection('users').get();
    for (const doc of finalSnapshot.docs) {
      const data = doc.data();
      const count = (data.unlockedContent || []).length;
      console.log(`📊 ${data.email}: ${count} unlocked items`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUnlockedContent();
