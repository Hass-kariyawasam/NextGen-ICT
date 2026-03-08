import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

import SignIn      from './pages/SignIn';
import Home        from './pages/Home';
import DashboardLMS from './pages/DashboardLMS';

// ✅ loadingUser true වෙලා තියෙනකොට spinner දාන්න
const ProtectedRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <Box sx={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        bgcolor: '#F8FAFC'
      }}>
        <CircularProgress sx={{ color: '#2563EB' }} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeContextProvider>
        <AuthContextProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard-lms/*" element={<ProtectedRoute><DashboardLMS /></ProtectedRoute>} />
              <Route path="*" element={<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 4, textAlign: 'center' }}><Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 900, color: '#e2e8f0' }}>404</Typography><Typography variant="h5" sx={{ color: '#64748b', mb: 3 }}>Page not found</Typography><Button variant="contained" onClick={() => window.location.href = '/'} sx={{ borderRadius: '10px', textTransform: 'none' }}>Go to Home</Button></Box>} />
            </Routes>
          </CartProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </Router>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, userData, loadingUser } = useAuth();

  // Wait for auth to load
  if (loadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not logged in → redirect to sign in
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Admin route but user is not admin
  if (requireAdmin && userData?.role !== 'admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Access Denied: Admin privileges required
        </Typography>
        <Button onClick={() => window.location.href = '/dashboard-lms'} sx={{ mt: 2 }}>
          Go to Student Dashboard
        </Button>
      </Box>
    );
  }

  return children;
}
export default function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"      element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/dashboard-lms/*" element={
              <ProtectedRoute>
                <DashboardLMS />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}