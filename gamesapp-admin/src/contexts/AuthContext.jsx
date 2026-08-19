import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();
const ADMIN_EMAIL = 'houssinetrabelsi6@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdminUser = user.email === ADMIN_EMAIL;
        setIsAdmin(isAdminUser);
        await saveUserToFirestore(user);
        setUser(user);
        console.log('✅ User signed in:', user.email);
      } else {
        setUser(null);
        setIsAdmin(false);
        console.log('ℹ️ No user signed in');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        createdAt: user.metadata?.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: user.email === ADMIN_EMAIL,
        providers: user.providerData?.map(p => p.providerId) || ['password'],
        purchases: [],
        unlockedContent: [],
        phone: '',
        bio: '',
        preferences: {
          language: 'fr',
          theme: 'light',
          notifications: true
        }
      };
      
      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
        console.log('✅ New user saved to Firestore:', user.email);
      } else {
        const existingData = userDoc.data();
        // Only update if fields don't exist
        const updateData = {
          lastLogin: new Date().toISOString(),
          isAdmin: user.email === ADMIN_EMAIL
        };
        
        // Add missing fields
        if (!existingData.phone) updateData.phone = '';
        if (!existingData.bio) updateData.bio = '';
        if (!existingData.preferences) {
          updateData.preferences = {
            language: 'fr',
            theme: 'light',
            notifications: true
          };
        }
        
        // Update display name if changed
        if (existingData.displayName !== user.displayName && user.displayName) {
          updateData.displayName = user.displayName;
        }
        
        await setDoc(userRef, updateData, { merge: true });
        console.log('🔄 User updated in Firestore:', user.email);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user);
      console.log('✅ Login successful!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Login error:', error.message);
      let errorMessage = error.message;
      if (error.message.includes('user-not-found')) {
        errorMessage = 'User not found. Please create an account first.';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Wrong password. Please try again.';
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      console.log('📝 Creating account for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      await saveUserToFirestore(userCredential.user);
      console.log('✅ Account created!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('🔐 Attempting Google login...');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      console.log('✅ Google login successful!');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Google login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logged out');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
