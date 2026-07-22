import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice.jsx';

// Component Imports
import { Navbar } from './components/Navbar'; 
import { Footer } from './components/Footer'; 

// Page Imports
import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { Profile } from './pages/Profile';
import { ProfileSetup } from './pages/ProfileSetup';
import { NotFound } from './pages/error/notFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './components/auth/Authpage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminBlockedUsers } from './pages/admin/AdminBlockedUsers';
import { UserDetailPage } from './pages/admin/UserDetailPage';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminQueries } from './components/admin/AdminQueries';
import { Toaster } from 'react-hot-toast';

import { SupportWidget } from './components/support/SupportWidget';

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, user, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, user, dispatch]);
  
  // Valid routes ki list where Navbar/Footer should be shown
  const isKnownRoute = !location.pathname.startsWith('/profile') && 
                       !location.pathname.startsWith('/auth') && 
                       !location.pathname.startsWith('/profile-setup') &&
                       !location.pathname.startsWith('/run/Dashboard');

  if (isLoading && token && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#111',
          color: '#fff',
          border: '1px solid #333',
        },
        success: { iconTheme: { primary: '#FACC15', secondary: '#111' } }
      }} />
      {isKnownRoute && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute requireProfile={false}>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile/*" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route path="/run/Dashboard" element={<AdminLoginPage />} />
        <Route 
          path="/run/Dashboard" 
          element={<AdminLayout />}
        >
          <Route path="home" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="blocked" element={<AdminBlockedUsers />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="user/:id" element={<UserDetailPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isKnownRoute && <Footer />}
      {!location.pathname.startsWith('/run/Dashboard') && <SupportWidget />}
    </>
  );
};

export const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;