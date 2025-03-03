import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { AIToybox } from './pages/AIToybox';
import { GrantWriter } from './pages/GrantWriter';
import { RFPFinderPage } from './pages/RFPFinder';
import { GrantFinderPage } from './pages/GrantFinder';
import { RFPManager } from './pages/RFPManager';
import { SocialMediaManager } from './pages/SocialMediaManager';
import { PricingPage } from './pages/PricingPage';
import { ToastProvider } from './components/Toast';
import { AIAssistant } from './components/AIAssistant';
import { settingsService } from './services/settingsService';
import { ContactSales } from './pages/ContactSales';
import { useScrollToTop } from './hooks/useScrollToTop';

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the attempted URL
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Apply settings on mount and when authentication changes
    if (isAuthenticated) {
      const settings = settingsService.getSettings();
      settingsService.applySettings(settings);
      
      // Handle redirect after login
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl && location.pathname === '/login') {
        sessionStorage.removeItem('redirectUrl');
        window.location.href = redirectUrl;
      }
    }
  }, [isAuthenticated, location]);

  // Redirect to dashboard if authenticated user tries to access login page
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/pricing" 
          element={
            <PrivateRoute>
              <PricingPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/ai-toybox" 
          element={
            <PrivateRoute>
              <AIToybox />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/grant-writer" 
          element={
            <PrivateRoute>
              <GrantWriter />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/rfp-finder" 
          element={
            <PrivateRoute>
              <RFPFinderPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/grant-finder" 
          element={
            <PrivateRoute>
              <GrantFinderPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/rfp-manager" 
          element={
            <PrivateRoute>
              <RFPManager />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/social-media-manager" 
          element={
            <PrivateRoute>
              <SocialMediaManager />
            </PrivateRoute>
          } 
        />
        <Route path="/contact-sales" element={
          <PrivateRoute>
            <ContactSales />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <AIAssistant />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App; 