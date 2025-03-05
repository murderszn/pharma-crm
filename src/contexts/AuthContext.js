import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [userPreferences, setUserPreferences] = useState({
    selectedApps: [], // Store selected app IDs
    lastUpdated: null
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('user', user ? JSON.stringify(user) : '');
  }, [isAuthenticated, user]);

  const login = (username, password) => {
    // Simulate authentication
    setIsAuthenticated(true);
    setUser({
      name: username,
      email: `${username}@example.com`
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserPreferences({
      selectedApps: [],
      lastUpdated: null
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  // New functions for managing app preferences
  const updateSelectedApps = (appIds) => {
    setUserPreferences({
      selectedApps: appIds,
      lastUpdated: new Date().toISOString()
    });
  };

  const toggleAppSelection = (appId) => {
    setUserPreferences(prev => {
      const isSelected = prev.selectedApps.includes(appId);
      return {
        selectedApps: isSelected 
          ? prev.selectedApps.filter(id => id !== appId)
          : [...prev.selectedApps, appId],
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    userPreferences,
    updateSelectedApps,
    toggleAppSelection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 