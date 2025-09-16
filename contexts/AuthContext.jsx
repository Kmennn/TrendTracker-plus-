import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, try to get the user from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      // Add a specific check to ensure the stored value is valid JSON and not '[object Object]'
      if (storedUser && storedUser !== '[object Object]') {
        setUser(JSON.parse(storedUser));
      } else if (storedUser) {
        // If the stored value is invalid, remove it.
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user'); // Clear corrupted data on parsing error
    } finally {
      setLoading(false);
    }
  }, []);
  
  // When user state changes, update localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to save user to localStorage', error);
    }
  }, [user]);


  const login = (email, password) => {
    console.log('Logging in with:', { email, password });
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        const loggedInUser = {
          name: 'John Doe',
          email: email,
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8b5cf6&color=fff',
          role: 'Admin',
        };
        setUser(loggedInUser);
        setLoading(false);
        resolve({ success: true });
      }, 1000);
    });
  };

  const signup = (name, email, password) => {
    console.log('Signing up with:', { name, email, password });
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        const signedUpUser = {
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=8b5cf6&color=fff`,
          role: 'User',
        };
        setUser(signedUpUser);
        setLoading(false);
        resolve({ success: true });
      }, 1000);
    });
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
  };
  
  const updateProfile = (profileData) => {
    setUser(prevUser => ({...prevUser, ...profileData}));
  }

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
  };

  // Render children only when not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};