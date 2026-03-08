import React, { useState } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, TextField,
  Button, Avatar, Divider, Alert, Chip
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { updatePassword } from 'firebase/auth';

export default function SettingsPage() {
  const { currentUser, userData } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    whatsapp: userData?.whatsapp || '',
    address: userData?.address || '',
    district: userData?.district || '',
    year: userData?.year || '',
  });

  const [passwords, setPasswords] = useState({
    newPassword: '', confirmPassword: ''
  });

  const handleProfileSave = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    try {
      await updatePassword(currentUser, passwords.newPassword);
      setSuccess('Password changed successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to change password. You may need to re-login first.');
    }
  };

  const displayName = userData?.name || currentUser?.displayName || 'Student';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        Settings & Profile
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        Manage your personal information and account settings.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Avatar section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar sx={{
                  width: 72, height: 72, bgcolor: '#2563EB',
                  fontSize: '1.8rem', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(37,99,235,0.3)'
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
                    {displayName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mb: 0.5 }}>
                    {currentUser?.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={userData?.studentType === 'physical' ? '🏫 Physical' : '💻 Online'}
                      size="small"
                      sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem' }}
                    />
                    {userData?.studentId && (
                      <Chip
                        label={`ID: ${userData.studentId}`}
                        size="small"
                        sx={{ bgcolor: '#F0FDF4', color: '#15803D', fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', mb: 2 }}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Full Name" value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Phone Number" value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="WhatsApp Number" value={profile.whatsapp}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="District" value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Year" value={profile.year}
                    onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Address" value={profile.address} multiline rows={2}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained" startIcon={<SaveRoundedIcon />}
                onClick={handleProfileSave} disabled={saving}
                sx={{ mt: 2.5, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', mb: 2 }}>
                Change Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="New Password" type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Confirm New Password" type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    InputProps={{ sx: { borderRadius: '10px' } }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="outlined" onClick={handlePasswordChange}
                sx={{ mt: 2, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}