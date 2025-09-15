import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a user token in local storage
    const timer = setTimeout(() => {
      // To test the public-only routes, you can set the initial user to null
      // setUser(null);
      
      // To test the protected routes, uncomment this block
      setUser({
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8b5cf6&color=fff',
        role: 'Admin', // Role can be 'Admin' or 'User'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = (email, password) => {
    console.log('Logging in with:', { email, password });
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setUser({
          name: 'John Doe',
          email: email,
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8b5cf6&color=fff',
          role: 'Admin',
        });
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
        setUser({
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=8b5cf6&color=fff`,
          role: 'User',
        });
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
