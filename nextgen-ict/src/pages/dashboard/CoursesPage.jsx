import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Divider,
  Avatar, Alert, IconButton, TextField, InputAdornment
} from '@mui/material';
import DeleteRoundedIcon       from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LinkRoundedIcon         from '@mui/icons-material/LinkRounded';
import CheckCircleRoundedIcon  from '@mui/icons-material/CheckCircleRounded';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, buyNow, cartTotal } = useCart();
  const navigate = useNavigate();

  // slipLinks: { courseId → driveLink string }
  const [slipLinks, setSlipLinks]   = useState({});
  const [loading,   setLoading]     = useState({});
  const [done,      setDone]        = useState({});
  const [linkError, setLinkError]   = useState({});

  const handleBuy = async (course) => {
    const link = slipLinks[course.id]?.trim() || null;

    // Basic Google Drive link check (optional but helpful)
    if (link && !link.startsWith('https://')) {
      setLinkError(p => ({ ...p, [course.id]: 'Please enter a valid https:// link.' }));
      return;
    }

    setLinkError(p => ({ ...p, [course.id]: '' }));
    setLoading(p => ({ ...p, [course.id]: true }));
    try {
      await buyNow(course, link);
      setDone(p => ({ ...p, [course.id]: true }));
    } catch (e) {
      console.error(e);
    }
    setLoading(p => ({ ...p, [course.id]: false }));
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        My Cart
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 10,
          border: '2px dashed #e2e8f0', borderRadius: '20px'
        }}>
          <ShoppingCartRoundedIcon sx={{ fontSize: '3rem', color: '#cbd5e1', mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
            Your Cart is Empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard-lms/courses')}
            sx={{ borderRadius: '12px', textTransform: 'none', mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {cart.map(course => (
            <Card key={course.id} sx={{
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 2.5 }}>

                {/* ── Course Row ── */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    src={course.thumbnail} variant="rounded"
                    sx={{ width: 72, height: 54, borderRadius: '10px' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                      {course.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {course.teacher}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                      Rs. {course.price.toLocaleString()}
                    </Typography>
                    <IconButton
                      size="small" color="error"
                      onClick={() => removeFromCart(course.id)}
                    >
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* ── Slip Link Input ── */}
                <Box sx={{
                  p: 2, borderRadius: '12px',
                  bgcolor: '#F8FAFC', border: '1px dashed #e2e8f0', mb: 2
                }}>
                  <Typography sx={{
                    fontSize: '0.8rem', fontWeight: 600,
                    color: '#475569', mb: 1
                  }}>
                    📎 Payment Slip Link
                    <Typography component="span" sx={{
                      fontWeight: 400, color: '#94a3b8',
                      fontSize: '0.75rem', ml: 0.5
                    }}>
                      (Google Drive share link — optional)
                    </Typography>
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://drive.google.com/file/d/..."
                    value={slipLinks[course.id] || ''}
                    onChange={e => setSlipLinks(p => ({ ...p, [course.id]: e.target.value }))}
                    error={!!linkError[course.id]}
                    helperText={linkError[course.id] || 'Upload your slip to Google Drive → Share → Copy link → Paste here'}
                    InputProps={{
                      sx: { borderRadius: '10px', bgcolor: '#fff', fontSize: '0.82rem' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkRoundedIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      endAdornment: slipLinks[course.id] && (
                        <InputAdornment position="end">
                          <CheckCircleRoundedIcon sx={{ fontSize: '1rem', color: '#10B981' }} />
                        </InputAdornment>
                      )
                    }}
                    FormHelperTextProps={{ sx: { fontSize: '0.7rem', mx: 0.5 } }}
                  />
                </Box>

                {/* ── Buy Button ── */}
                <Button
                  fullWidth variant="contained"
                  onClick={() => handleBuy(course)}
                  disabled={!!loading[course.id]}
                  sx={{
                    borderRadius: '10px', textTransform: 'none',
                    fontWeight: 600, py: 1.2,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
                  }}
                >
                  {loading[course.id]
                    ? 'Submitting…'
                    : `Buy Now — Rs. ${course.price.toLocaleString()}`}
                </Button>

              </CardContent>
            </Card>
          ))}

          {/* ── Order Total ── */}
          <Card sx={{
            borderRadius: '16px', bgcolor: '#F8FAFC',
            border: '1px solid #e2e8f0', boxShadow: 'none'
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                  Total
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563EB' }}>
                  Rs. {cartTotal.toLocaleString()}
                </Typography>
              </Box>
              <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.78rem' }}>
                After payment, upload your slip to Google Drive, set sharing to
                <strong> "Anyone with the link"</strong>, paste the link above, then click Buy Now.
                Enrollment will be approved within 24 hours.
              </Alert>
            </CardContent>
          </Card>

        </Box>
      )}
    </Box>
  );
}