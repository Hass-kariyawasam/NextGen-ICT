// File: src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import SignInSide from './pages/SignInSide';
import Home from './pages/Home'; // ඔයාගේ Landing Page එක මෙතනට Link කරන්න

// Login වෙලා නැත්නම් Dashboard එකට යන්න බෑ
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

// LMS Dashboard (දැනට සරලව)
const DashboardLMS = () => {
    const { logOut, user } = useAuth();
    return (
        <div style={{ padding: 50, color: 'white', backgroundColor: '#1E0342', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Welcome to Nextgen LMS Dashboard</h1>
            <h3>Hello, {user?.email}</h3>
            <p>Your Role: Student</p>
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
                        {/* Landing Page */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Login Page */}
                        <Route path="/login" element={<SignInSide />} />
                        
                        {/* Dashboard (Protected) */}
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