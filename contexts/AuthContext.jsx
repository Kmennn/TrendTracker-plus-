import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../src/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Map Firebase user to our app's user structure
        const mappedUser = {
          uid: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          avatar: currentUser.photoURL || '/avatar.png',
          role: 'User', // Default role for now
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      let errorMessage = 'Login failed.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
      if (error.code === 'auth/user-not-found') errorMessage = 'No account found with this email.';
      if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name immediately after signup
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Force update of local state to reflect name immediately
      setUser(prev => ({ ...prev, name: name }));
      
      return { success: true };
    } catch (error) {
        console.error("Signup Error:", error);
      let errorMessage = 'Signup failed.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email is already in use.';
      if (error.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateUserProfile = async (profileData) => {
      // Could implement proper profile updates here
      if (auth.currentUser) {
          if (profileData.name) {
             await updateProfile(auth.currentUser, { displayName: profileData.name });
             setUser(prev => ({ ...prev, name: profileData.name }));
          }
      }
  };

  const getUserToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateUserProfile,
    getUserToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
