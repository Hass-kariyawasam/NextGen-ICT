import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';

// Pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';

// Protected Route (Login wela nathnam Dashboard yanna ba)
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Dashboard Component
const DashboardLMS = () => {
    const { logOut, user } = useAuth();
    return (
        <div style={{ padding: 50, color: 'white', backgroundColor: '#1E0342', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Welcome to Nextgen LMS Dashboard</h1>
            <h3>Hello, {user?.email}</h3>
            <button onClick={logOut} style={{ padding: '12px 24px', cursor: 'pointer', marginTop: 20, borderRadius: 8, border: 'none', background: '#0E46A3', color: 'white' }}>Log Out</button>
        </div>
    );
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
                        <Route path="/login" element={<SignIn />}/>
                        
                        {/* Dashboard */}
                        <Route path="/dashboard-lms" element={
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