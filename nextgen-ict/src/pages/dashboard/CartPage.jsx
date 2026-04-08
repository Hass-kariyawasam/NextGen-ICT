import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, buyNow, cartTotal } = useCart();
  const [slipLinks, setSlipLinks] = useState({});
  const [loadingId, setLoadingId] = useState('');

  const submit = async (course) => {
    setLoadingId(course.id);
    await buyNow(course, slipLinks[course.id] || null);
    setLoadingId('');
  };

  return (
    <Box>
      <Box className="lms-page-head">
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Cart</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Paste the payment slip link and submit each course for approval.</Typography>
        </Box>
      </Box>

      {!cart.length ? (
        <Box className="lms-panel" sx={{ borderRadius: 5, py: 8, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>Your cart is empty</Typography>
          <Typography sx={{ color: '#64748b', mb: 2 }}>Add a course first to continue with payment submission.</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard-lms/courses')} sx={{ borderRadius: 3, textTransform: 'none' }}>Browse courses</Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={2.5}>
              {cart.map((course) => (
                <Grid item xs={12} key={course.id}>
                  <Card className="lms-panel" sx={{ borderRadius: 5 }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>{course.title}</Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{course.teacher}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>Rs. {Number(course.price || 0).toLocaleString()}</Typography>
                          <IconButton onClick={() => removeFromCart(course.id)} color="error"><DeleteRoundedIcon /></IconButton>
                        </Box>
                      </Box>

                      <TextField
                        fullWidth
                        placeholder="Paste Google Drive or hosted payment slip link"
                        value={slipLinks[course.id] || ''}
                        onChange={(e) => setSlipLinks((prev) => ({ ...prev, [course.id]: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><LinkRoundedIcon sx={{ color: '#64748b' }} /></InputAdornment>
                        }}
                        sx={{ mb: 2 }}
                      />

                      <Button variant="contained" onClick={() => submit(course)} disabled={loadingId === course.id} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
                        {loadingId === course.id ? <><CircularProgress size={18} sx={{ mr: 1, color: '#fff' }} />Submitting</> : 'Submit for approval'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card className="lms-panel" sx={{ borderRadius: 5, position: { lg: 'sticky' }, top: 110 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>Summary</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 2 }}>{cart.length} course(s) in cart</Typography>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', mb: 2 }}>Rs. {cartTotal.toLocaleString()}</Typography>
                <Alert severity="info" sx={{ borderRadius: 4 }}>
                  Set the slip file to be viewable by link, then paste the URL before submitting.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
