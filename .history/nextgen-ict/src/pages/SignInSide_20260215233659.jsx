import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// ColorModeContext වෙනුවට useColorMode ගන්න
import { useColorMode } from '../context/ThemeContext'; 

import {
  Box, Button, CssBaseline, FormControl, FormLabel, Grid, IconButton, Link, 
  MenuItem, Paper, Select, Stack, TextField, Typography, useTheme, Alert
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GoogleIcon from '@mui/icons-material/Google'; 

const VALID_PHYSICAL_IDS = ["ST001", "ST002", "ST003", "1234"]; 

export default function SignInSide() {
  const theme = useTheme();
  // මෙන්න මේ පේලිය වෙනස් වුනා:
  const colorMode = useColorMode(); 
  
  const { logIn, signUp, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    phone: '', studentType: '', 
    year: '', district: '', whatsapp: '',
    center: '', studentId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await logIn(formData.email, formData.password);
      navigate('/dashboard-lms');
    } catch (err) {
      if(err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('No account found. Please Register first.');
      } else {
        setError("Login Failed: " + err.message);
      }
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.email || !formData.phone || !formData.studentType) {
        setError("Please fill all fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.studentType === 'physical') {
        if (!VALID_PHYSICAL_IDS.includes(formData.studentId)) {
          setError("Invalid Student ID. Please check your card.");
          return;
        }
      }
      setStep(3);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
        const userData = {
            phone: formData.phone,
            studentType: formData.studentType,
            whatsapp: formData.whatsapp || formData.phone,
        };

        if(formData.studentType === 'online') {
            userData.year = formData.year;
            userData.district = formData.district;
        } else {
            userData.center = formData.center;
            userData.studentId = formData.studentId;
        }

        await signUp(formData.email, formData.password, userData);
        navigate('/dashboard-lms');
    } catch (err) {
        setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
      try {
          await googleSignIn();
          navigate('/dashboard-lms');
      } catch (err) {
          setError(err.message);
      }
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?technology)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
        }}
      >
        <Box sx={{ position: 'fixed', top: 20, left: 20 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
        <Box sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.6)', p: 4, borderRadius: 2 }}>
            <Typography variant="h3" fontWeight="bold">Nextgen ICT</Typography>
            <Typography variant="h6">The Future of Learning</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <img src="/agentix-react/assets/logo.svg" alt="Logo" style={{ width: 120, marginBottom: 20 }} />
          
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign in to LMS' : 'Student Registration'}
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

          {isLogin ? (
             <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                <TextField margin="normal" required fullWidth label="Email Address" name="email" autoFocus onChange={handleChange} />
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password" onChange={handleChange} />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>Sign In</Button>
                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin} sx={{ mb: 2 }}>Sign in with Google</Button>
                <Grid container>
                  <Grid item xs><Link href="#" variant="body2">Forgot password?</Link></Grid>
                  <Grid item><Link href="#" variant="body2" onClick={() => setIsLogin(false)}>{"Don't have an account? Register"}</Link></Grid>
                </Grid>
             </Box>
          ) : (
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                {step === 1 && (
                    <>
                        <TextField margin="normal" required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                        <TextField margin="normal" required fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Select Student Type</FormLabel>
                            <Select name="studentType" value={formData.studentType} onChange={handleChange}>
                                <MenuItem value="online">Online Student</MenuItem>
                                <MenuItem value="physical">Physical Student</MenuItem>
                            </Select>
                        </FormControl>
                        <Button fullWidth variant="contained" onClick={handleNextStep} sx={{ mt: 3, mb: 2 }}>Next</Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        {formData.studentType === 'online' ? (
                            <>
                                <FormControl fullWidth margin="normal">
                                    <FormLabel>Exam Year</FormLabel>
                                    <Select name="year" value={formData.year} onChange={handleChange}>
                                        <MenuItem value="2026">2026</MenuItem>
                                        <MenuItem value="2027">2027</MenuItem>
                                        <MenuItem value="2028">2028</MenuItem>
                                        <MenuItem value="2029">2029</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <FormLabel>District</FormLabel>
                                    <Select name="district" value={formData.district} onChange={handleChange}>
                                        <MenuItem value="Colombo">Colombo</MenuItem>
                                        <MenuItem value="Gampaha">Gampaha</MenuItem>
                                        <MenuItem value="Galle">Galle</MenuItem>
                                        <MenuItem value="Matara">Matara</MenuItem>
                                        <MenuItem value="Hambantota">Hambantota</MenuItem>
                                        <MenuItem value="Ratnapura">Ratnapura</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <FormControl fullWidth margin="normal">
                                    <FormLabel>Select Class Center</FormLabel>
                                    <Select name="center" value={formData.center} onChange={handleChange}>
                                        <MenuItem value="Embilipitiya Victory">Embilipitiya Victory</MenuItem>
                                        <MenuItem value="Matara Rasara">Matara Rasara</MenuItem>
                                        <MenuItem value="Galle Sipara">Galle Sipara</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField margin="normal" required fullWidth label="Student ID (from Card)" name="studentId" value={formData.studentId} onChange={handleChange} helperText="Enter ID (e.g., ST001)" />
                            </>
                        )}
                        <TextField margin="normal" fullWidth label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button fullWidth variant="outlined" onClick={() => setStep(1)}>Back</Button>
                            <Button fullWidth variant="contained" onClick={handleNextStep}>Next</Button>
                        </Stack>
                    </>
                )}

                {step === 3 && (
                    <>
                        <TextField margin="normal" required fullWidth name="password" label="Create Password" type="password" value={formData.password} onChange={handleChange} />
                        <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} />
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button fullWidth variant="outlined" onClick={() => setStep(2)}>Back</Button>
                            <Button type="submit" fullWidth variant="contained">Complete Registration</Button>
                        </Stack>
                    </>
                )}
                <Grid container sx={{ mt: 2 }}>
                  <Grid item><Link href="#" variant="body2" onClick={() => { setIsLogin(true); setStep(1); }}>{"Already have an account? Sign In"}</Link></Grid>
                </Grid>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}