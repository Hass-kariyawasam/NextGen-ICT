import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';

// Pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import DashboardLMS from './pages/DashboardLMS';

// Protected Route
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default function App() {
    return (
        <ThemeContextProvider>
            <AuthContextProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Main Landing Page */}
                        <Route path="/" element={<Home />} />

                        {/* Login Page */}
                        <Route path="/login" element={<SignIn />} />

                        {/* Dashboard — all sub-routes handled inside DashboardLMS */}
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