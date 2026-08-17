// This is a browser console script - run this in the browser console when logged in as admin
// Copy and paste this entire script into the browser console (F12)

async function directFix() {
  console.log('🔧 Starting direct fix...');
  
  // Get the current admin user
  const adminUser = firebase.auth().currentUser;
  if (!adminUser) {
    console.log('❌ Please login as admin first');
    return;
  }
  
  // Get Firestore
  const db = firebase.firestore();
  
  try {
    // 1. Get all approved requests
    const requestsSnapshot = await db.collection('premiumRequests')
      .where('status', '==', 'approved')
      .get();
    
    console.log(`📊 Found ${requestsSnapshot.size} approved requests`);
    
    // 2. Get all users
    const usersSnapshot = await db.collection('users').get();
    const users = {};
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users[data.uid] = { id: doc.id, ...data };
    });
    console.log(`📊 Found ${Object.keys(users).length} users`);
    
    let count = 0;
    
    // 3. Process each request
    for (const requestDoc of requestsSnapshot.docs) {
      const request = requestDoc.data();
      console.log(`\n📝 Processing: ${request.itemName} for ${request.userEmail}`);
      console.log(`   User UID: ${request.userId}`);
      
      // Find the user by uid
      const user = users[request.userId];
      if (!user) {
        console.log(`❌ User not found with uid: ${request.userId}`);
        console.log(`   Available UIDs: ${Object.keys(users).join(', ')}`);
        continue;
      }
      
      console.log(`✅ Found user: ${user.email}`);
      console.log(`   User doc ID: ${user.id}`);
      
      // Get current unlocked content
      const unlocked = user.unlockedContent || [];
      console.log(`   Current unlocked: ${unlocked.length} items`);
      
      // Check if already unlocked
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
        
        // Update the user document
        await db.collection('users').doc(user.id).update({
          unlockedContent: [...unlocked, newContent]
        });
        
        count++;
        console.log(`✅ Added: ${request.itemName} to ${user.email}`);
      } else {
        console.log(`ℹ️ Already unlocked: ${request.itemName}`);
      }
    }
    
    console.log(`\n✅ Complete! Added ${count} items to users.`);
    
    // Verify
    const verifySnapshot = await db.collection('users').get();
    console.log('\n📊 Final user status:');
    verifySnapshot.forEach(doc => {
      const data = doc.data();
      const count = (data.unlockedContent || []).length;
      console.log(`📊 ${data.email}: ${count} unlocked items`);
      if (count > 0) {
        console.log('  Items:', data.unlockedContent.map(i => i.name).join(', '));
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the fix
directFix();
