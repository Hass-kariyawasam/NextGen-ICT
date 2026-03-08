import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, CssBaseline, FormLabel, FormControl, Link, TextField, 
  Typography, Stack, Card as MuiCard, Select, MenuItem, Alert, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GoogleIcon, SitemarkIcon } from '../components/CustomIcons';
import ForgotPassword from '../components/ForgotPassword';

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
  const { signUp, googleSignIn, logInWithEmailOrPhone } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
    studentType: '', year: '', district: '', whatsapp: '', center: '', studentId: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await logInWithEmailOrPhone(loginIdentifier, loginPassword);
      navigate('/dashboard-lms');
    } catch (err) {
      setError('Account not found or password incorrect.');
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.studentType) {
        setError("Please fill all fields."); return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.studentType === 'physical' && !VALID_PHYSICAL_IDS.includes(formData.studentId)) {
        setError("Invalid Student ID."); return;
      }
      setStep(3);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    try {
      const userData = { name: formData.name, phone: formData.phone, studentType: formData.studentType, whatsapp: formData.whatsapp || formData.phone };
      if(formData.studentType === 'online') { userData.year = formData.year; userData.district = formData.district; }
      else { userData.center = formData.center; userData.studentId = formData.studentId; }
      await signUp(formData.email, formData.password, userData);
      navigate('/dashboard-lms');
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>{isLogin ? 'Sign in' : 'Register'}</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLogin ? (
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                  <FormLabel>Email or Phone Number</FormLabel>
                  <TextField required fullWidth value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} />
                </FormControl>
                <FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel>Password</FormLabel>
                    <Link component="button" type="button" onClick={() => setOpen(true)} variant="body2">Forgot password?</Link>
                  </Box>
                  <TextField required fullWidth type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </FormControl>
                <Button type="submit" fullWidth variant="contained">Sign in</Button>
              </Box>
            ) : (
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {step === 1 && (
                  <>
                    <TextField required fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <TextField required fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
                    <TextField required fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
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
                {step === 2 && (
                    <>
                        {formData.studentType === 'online' ? (
                            <Stack spacing={2}>
                                <TextField select fullWidth label="Year" name="year" value={formData.year} onChange={handleChange}>
                                    <MenuItem value="2026">2026</MenuItem><MenuItem value="2027">2027</MenuItem>
                                </TextField>
                                <TextField select fullWidth label="District" name="district" value={formData.district} onChange={handleChange}>
                                    <MenuItem value="Colombo">Colombo</MenuItem><MenuItem value="Galle">Galle</MenuItem>
                                </TextField>
                            </Stack>
                        ) : (
                            <Stack spacing={2}>
                                <TextField select fullWidth label="Center" name="center" value={formData.center} onChange={handleChange}>
                                    <MenuItem value="Victory">Victory</MenuItem><MenuItem value="Rasara">Rasara</MenuItem>
                                </TextField>
                                <TextField required fullWidth label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} />
                            </Stack>
                        )}
                        <Button fullWidth variant="contained" onClick={handleNextStep}>Next</Button>
                    </>
                )}
                {step === 3 && (
                  <Stack spacing={2}>
                    <TextField required fullWidth label="Password" name="password" type="password" onChange={handleChange} />
                    <TextField required fullWidth label="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} />
                    <Button fullWidth variant="contained" onClick={handleRegister}>Register</Button>
                  </Stack>
                )}
              </Box>
            )}
          </Box>
          <Divider>or</Divider>
          <Button fullWidth variant="outlined" onClick={googleSignIn} startIcon={<GoogleIcon />}>Sign in with Google</Button>
          <Typography sx={{ textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => {setIsLogin(!isLogin); setStep(1); setError(''); }}>
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </>
  );
}