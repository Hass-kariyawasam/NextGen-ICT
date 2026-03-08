import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, TextField,
  Button, Alert, InputAdornment, IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hardcoded admin credentials check
      if (username === 'admin' && password === 'admin12345678') {
        // Try to sign in with default admin email
        // You should create this admin user in Firebase Auth first
        const adminEmail = 'admin@nextgen-ict.com';
        const adminPassword = 'admin12345678';

        try {
          const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
          
          // Check if user has admin role
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            // Redirect to admin dashboard
            navigate('/admin/dashboard');
          } else {
            setError('You do not have admin privileges.');
            await auth.signOut();
          }
        } catch (authError) {
          console.error('Auth error:', authError);
          // If admin user doesn't exist in Firebase, show instructions
          setError('Admin account not set up. Please contact system administrator.');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
              }}
            >
              <AdminIcon sx={{ fontSize: '3rem', color: '#fff' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Admin Panel
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
              NextGen-ICT Learning Management System
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6a3f8f 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Default Credentials Info */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: '12px',
              bgcolor: '#F0F4FF',
              border: '1px solid #E0E7FF'
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', color: '#4338CA', fontWeight: 600, mb: 1 }}>
              📌 Default Admin Credentials
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6366F1', fontFamily: 'monospace' }}>
              Username: <strong>admin</strong>
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6366F1', fontFamily: 'monospace' }}>
              Password: <strong>admin12345678</strong>
            </Typography>
          </Box>

          {/* Back to Student Login */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => navigate('/signin')}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                fontSize: '0.9rem'
              }}
            >
              ← Back to Student Login
            </Button>
          </Box>
        </Paper>

        {/* Setup Instructions */}
        <Paper
          sx={{
            mt: 3,
            p: 3,
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            🔧 First Time Setup Instructions:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 1 }}>
            1. Create admin user in Firebase Authentication:
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b', ml: 2, mb: 1, fontFamily: 'monospace' }}>
            Email: admin@nextgen-ict.com
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b', ml: 2, mb: 2, fontFamily: 'monospace' }}>
            Password: admin12345678
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 1 }}>
            2. Add admin role in Firestore users collection:
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b', ml: 2, fontFamily: 'monospace' }}>
            role: "admin"
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
