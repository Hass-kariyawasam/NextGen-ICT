import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';

import {
  Box, Button, Checkbox, CssBaseline, FormControlLabel, Divider, FormLabel,
  FormControl, Link, TextField, Typography, Stack, Card as MuiCard,
  Select, MenuItem, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import { GoogleIcon, SitemarkIcon } from '../components/CustomIcons';
import ForgotPassword from '../components/ForgotPassword';

// --- STYLED COMPONENTS ---
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%',
  padding: theme.spacing(4), gap: theme.spacing(2), margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh', minHeight: '100%', padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""', display: 'block', position: 'absolute', zIndex: -1, inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const VALID_PHYSICAL_IDS = ["ST001", "ST002", "ST003", "1234"];

export default function SignIn() {
  // logIn WithEmailOrPhone පාවිච්චි කරනවා
  const { signUp, googleSignIn, logInWithEmailOrPhone } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  
  const [step, setStep] = useState(1);
  // Login වෙද්දී Identifier (Email or Phone) එක ගන්න වෙනම state එකක්
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form Data
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    phone: '', studentType: '', year: '', district: '', whatsapp: '', center: '', studentId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // මෙතන අලුත් function එක call කරනවා
      await logInWithEmailOrPhone(loginIdentifier, loginPassword);
      navigate('/dashboard-lms');
    } catch (err) {
      if(err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('Account not found or password incorrect.');
      else setError("Login Failed: " + err.message);
    }
  };

  // --- REGISTER HANDLERS ---
  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      // Email සහ Phone අනිවාර්යයි
      if (!formData.email || !formData.phone || !formData.studentType) { setError("Please fill all fields."); return; }
      setStep(2);
    } else if (step === 2) {
      if (formData.studentType === 'physical') {
        if (!VALID_PHYSICAL_IDS.includes(formData.studentId)) { setError("Invalid Student ID."); return; }
      }
      setStep(3);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    try {
        const userData = { phone: formData.phone, studentType: formData.studentType, whatsapp: formData.whatsapp || formData.phone };
        if(formData.studentType === 'online') { userData.year = formData.year; userData.district = formData.district; }
        else { userData.center = formData.center; userData.studentId = formData.studentId; }
        
        // SMS Code යවන්නේ නෑ, කෙලින්ම Register කරනවා
        await signUp(formData.email, formData.password, userData);
        navigate('/dashboard-lms');
    } catch (err) { setError(err.message); }
  };

  const handleGoogleSignIn = async () => {
      try {
          await googleSignIn();
          navigate('/dashboard-lms');
      } catch (err) {
          setError(err.message);
      }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mb: 2 }}>
            {isLogin ? 'Sign in' : 'Register'}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            
            {/* --- LOGIN FORM --- */}
            {isLogin ? (
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        {/* Label එක වෙනස් කළා */}
                        <FormLabel htmlFor="identifier">Email or Phone Number</FormLabel>
                        <TextField required fullWidth id="identifier" name="identifier" 
                            placeholder="user@email.com or 0771234567" 
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)} 
                            variant="outlined" 
                        />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Link component="button" type="button" onClick={() => setOpen(true)} variant="body2" sx={{ alignSelf: 'baseline' }}>Forgot password?</Link>
                        </Box>
                        <TextField required fullWidth name="password" placeholder="••••••" type="password" id="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            variant="outlined" 
                        />
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained">Sign in</Button>
                </Box>
            ) : (
                /* --- REGISTER FORM (SMS Logic අයින් කරලා) --- */
                <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {step === 1 && (
                        <>
                            <TextField required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                            <TextField required fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="0771234567" />
                            <FormControl fullWidth>
                                <FormLabel>Student Type</FormLabel>
                                <Select name="studentType" value={formData.studentType} onChange={handleChange}>
                                    <MenuItem value="online">Online Student</MenuItem>
                                    <MenuItem value="physical">Physical Student</MenuItem>
                                </Select>
                            </FormControl>
                            <Button fullWidth variant="contained" onClick={handleNextStep}>Next</Button>
                        </>
                    )}
                    
                    {/* Step 2 (Online/Physical Details) */}
                    {step === 2 && (
                        <>
                            {formData.studentType === 'online' ? (
                                <>
                                    <FormControl fullWidth>
                                        <FormLabel>Exam Year</FormLabel>
                                        <Select name="year" value={formData.year} onChange={handleChange}>
                                            <MenuItem value="2026">2026</MenuItem>
                                            <MenuItem value="2027">2027</MenuItem>
                                            <MenuItem value="2028">2028</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <FormLabel>District</FormLabel>
                                        <Select name="district" value={formData.district} onChange={handleChange}>
                                            <MenuItem value="Colombo">Colombo</MenuItem>
                                            <MenuItem value="Gampaha">Gampaha</MenuItem>
                                            <MenuItem value="Galle">Galle</MenuItem>
                                            <MenuItem value="Matara">Matara</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            ) : (
                                <>
                                    <FormControl fullWidth>
                                        <FormLabel>Select Class Center</FormLabel>
                                        <Select name="center" value={formData.center} onChange={handleChange}>
                                            <MenuItem value="Embilipitiya Victory">Embilipitiya Victory</MenuItem>
                                            <MenuItem value="Matara Rasara">Matara Rasara</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField required fullWidth label="Student ID (from Card)" name="studentId" value={formData.studentId} onChange={handleChange} />
                                </>
                            )}
                            <TextField fullWidth label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth variant="outlined" onClick={() => setStep(1)}>Back</Button>
                                <Button fullWidth variant="contained" onClick={handleNextStep}>Next</Button>
                            </Stack>
                        </>
                    )}

                    {/* Step 3 (Password) */}
                    {step === 3 && (
                        <>
                            <TextField required fullWidth name="password" label="Create Password" type="password" value={formData.password} onChange={handleChange} />
                            <TextField required fullWidth name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} />
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth variant="outlined" onClick={() => setStep(2)}>Back</Button>
                                <Button type="submit" variant="contained" fullWidth onClick={handleRegister}>Register</Button>
                            </Stack>
                        </>
                    )}
                </Box>
            )}

          </Box>
          
          <Divider>or</Divider>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />}>
              Sign in with Google
            </Button>
            
            <Typography sx={{ textAlign: 'center' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link component="button" variant="body2" onClick={() => {setIsLogin(!isLogin); setStep(1); setError(''); }} sx={{ alignSelf: 'center' }}>
                {isLogin ? "Sign up" : "Sign in"}
              </Link>
            </Typography>
          </Box>

        </Card>
      </SignInContainer>
      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </>
  );
}