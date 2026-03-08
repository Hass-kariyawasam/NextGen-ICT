import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent,
  TextField, Button, Avatar, Divider, Alert, Chip
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, userData, updateUserData, changePassword } = useAuth();

  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', whatsapp: '',
    address: '', district: '', year: ''
  });

  const [pwd, setPwd] = useState({ newPassword: '', confirmPassword: '' });

  // Populate form from Firestore userData
  useEffect(() => {
    if (userData) {
      setForm({
        name:     userData.name     || '',
        phone:    userData.phone    || '',
        whatsapp: userData.whatsapp || '',
        address:  userData.address  || '',
        district: userData.district || '',
        year:     userData.year     || '',
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      await updateUserData(user.uid, form);
      setSuccess('Profile updated successfully!');
    } catch (e) {
      setError('Failed to update. Please try again.');
    }
    setSaving(false);
  };

  const handlePwdChange = async () => {
    setError(''); setSuccess('');
    if (pwd.newPassword.length < 6)
      return setError('Password must be at least 6 characters.');
    if (pwd.newPassword !== pwd.confirmPassword)
      return setError('Passwords do not match.');
    try {
      await changePassword(pwd.newPassword);
      setSuccess('Password changed!');
      setPwd({ newPassword: '', confirmPassword: '' });
    } catch {
      setError('Failed — please re-login and try again.');
    }
  };

  const displayName = userData?.name || user?.displayName || 'Student';

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        Settings & Profile
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        Manage your personal information and account settings.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* ── Profile Card ── */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>

              {/* Avatar row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
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
                  <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {user?.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={userData?.studentType === 'physical' ? '🏫 Physical' : '💻 Online'}
                      size="small" sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.72rem' }}
                    />
                    {userData?.studentId && (
                      <Chip label={`ID: ${userData.studentId}`} size="small"
                        sx={{ bgcolor: '#F0FDF4', color: '#15803D', fontSize: '0.72rem' }} />
                    )}
                    {userData?.year && (
                      <Chip label={`Year: ${userData.year}`} size="small"
                        sx={{ bgcolor: '#FFF7ED', color: '#C2410C', fontSize: '0.72rem' }} />
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#475569', mb: 2 }}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                {[
                  { label: 'Full Name',       key: 'name',     xs: 12, sm: 6 },
                  { label: 'Phone Number',    key: 'phone',    xs: 12, sm: 6 },
                  { label: 'WhatsApp Number', key: 'whatsapp', xs: 12, sm: 6 },
                  { label: 'District',        key: 'district', xs: 12, sm: 6 },
                  { label: 'Year',            key: 'year',     xs: 12, sm: 6 },
                  { label: 'Address',         key: 'address',  xs: 12, multiline: true },
                ].map(f => (
                  <Grid item xs={f.xs} sm={f.sm} key={f.key}>
                    <TextField
                      fullWidth label={f.label} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      multiline={f.multiline} rows={f.multiline ? 2 : 1}
                      InputProps={{ sx: { borderRadius: '10px' } }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained" startIcon={<SaveRoundedIcon />}
                onClick={handleSave} disabled={saving}
                sx={{ mt: 2.5, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Password Card ── */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#475569', mb: 2 }}>
                Change Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="New Password" type="password"
                    value={pwd.newPassword}
                    onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))}
                    InputProps={{ sx: { borderRadius: '10px' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Confirm Password" type="password"
                    value={pwd.confirmPassword}
                    onChange={e => setPwd(p => ({ ...p, confirmPassword: e.target.value }))}
                    InputProps={{ sx: { borderRadius: '10px' } }} />
                </Grid>
              </Grid>
              <Button variant="outlined" onClick={handlePwdChange}
                sx={{ mt: 2, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}