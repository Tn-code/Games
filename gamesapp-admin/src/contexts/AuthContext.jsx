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
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
      } else {
        setUser(null);
        setIsAdmin(false);
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
        unlockedContent: [] // <-- This is the key field
      };
      
      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
        console.log('✅ New user created with unlockedContent: []');
      } else {
        // Update existing user, but ensure unlockedContent exists
        const existingData = userDoc.data();
        if (!existingData.unlockedContent) {
          await setDoc(userRef, {
            ...existingData,
            unlockedContent: [],
            lastLogin: new Date().toISOString()
          }, { merge: true });
          console.log('✅ Added unlockedContent to existing user');
        } else {
          await setDoc(userRef, {
            ...existingData,
            lastLogin: new Date().toISOString()
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      await saveUserToFirestore(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
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
