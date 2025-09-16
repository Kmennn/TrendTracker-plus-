import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.name) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('AuthContext: Corrupted user data in localStorage, clearing.', error);
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
          uid: `user_${new Date().getTime()}`,
          name: 'John Doe',
          email: email,
          avatar: '/avatar.png',
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
          uid: `user_${new Date().getTime()}`,
          name: name,
          email: email,
          avatar: '/avatar.png',
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
    setUser(prevUser => ({ ...prevUser, ...profileData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
