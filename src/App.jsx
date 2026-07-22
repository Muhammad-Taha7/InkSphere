import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './Website/Store/Slices/authSlice.jsx';

// Component Imports
import { Navbar } from './Website/Components/Navbar'; 
import { Footer } from './Website/Components/Footer'; 

// Page Imports
import { Home } from './Website/Pages/Home';
import { Blogs } from './Website/Pages/Blogs';
import { BlogDetail } from './Website/Pages/BlogDetail';
import { Profile } from './Website/Pages/Profile';
import { ProfileSetup } from './Website/Pages/ProfileSetup';
import { NotFound } from './Website/Error/notFound';
import { ProtectedRoute } from './Website/protectedRoute';
import { AuthPage } from './Website/Components/Auth/Authpage';
import { AdminLayout } from './Website/Components/Admin/AdminLayout';
import { AdminLoginPage } from './Website/Pages/Admin/AdminLoginPage';
import { AdminDashboard } from './Website/Pages/Admin/AdminDashboard';
import { AdminUsers } from './Website/Pages/Admin/AdminUsers';
import { AdminBlockedUsers } from './Website/Pages/Admin/AdminBlockedUsers';
import { UserDetailPage } from './Website/Pages/Admin/UserDetailPage';
import { AdminSettings } from './Website/Pages/Admin/AdminSettings';
import { Toaster } from 'react-hot-toast';

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
          <Route path="user/:id" element={<UserDetailPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isKnownRoute && <Footer />}
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