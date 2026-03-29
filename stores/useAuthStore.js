/**
 * Auth Store - Zustand
 * Modern replacement for AuthContext with simpler API.
 * Can be used alongside AuthContext during migration.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../src/firebaseConfig';

// User type
const createMappedUser = (firebaseUser) => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || 'User',
    email: firebaseUser.email,
    avatar: firebaseUser.photoURL || '/avatar.png',
    role: 'User',
  };
};

// Store definition
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      error: null,

      // Initialize auth listener
      initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          set({ 
            user: createMappedUser(firebaseUser), 
            loading: false 
          });
        });
        return unsubscribe;
      },

      // Actions
      login: async (email, password) => {
        set({ error: null });
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return { success: true };
        } catch (error) {
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      signup: async (name, email, password) => {
        set({ error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: name });
          set({ user: createMappedUser(userCredential.user) });
          return { success: true };
        } catch (error) {
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      updateUserProfile: async (profileData) => {
        if (auth.currentUser && profileData.name) {
          await updateProfile(auth.currentUser, { displayName: profileData.name });
          set((state) => ({ 
            user: { ...state.user, name: profileData.name } 
          }));
        }
      },

      getToken: async () => {
        if (auth.currentUser) {
          return await auth.currentUser.getIdToken();
        }
        return null;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);

// Helper function for auth errors
function getAuthErrorMessage(code) {
  const messages = {
    'auth/wrong-password': 'Incorrect password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/email-already-in-use': 'Email is already in use.',
    'auth/weak-password': 'Password should be at least 6 characters.',
  };
  return messages[code] || 'Authentication failed.';
}

export default useAuthStore;
