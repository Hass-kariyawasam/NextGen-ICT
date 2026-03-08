import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

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