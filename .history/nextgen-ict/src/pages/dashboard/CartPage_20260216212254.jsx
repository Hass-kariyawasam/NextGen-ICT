import React, { useState, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Divider,
  Avatar, Chip, Alert, LinearProgress, IconButton
} from '@mui/material';
import DeleteRoundedIcon        from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon  from '@mui/icons-material/ShoppingCartRounded';
import UploadFileRoundedIcon    from '@mui/icons-material/UploadFileRounded';
import CheckCircleRoundedIcon   from '@mui/icons-material/CheckCircleRounded';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';   // add storage export to config.js

export default function CartPage() {
  const { cart, removeFromCart, buyNow, cartTotal } = useCart();
  const { user, userData }                          = useAuth();
  const navigate                                    = useNavigate();

  const [slipFiles, setSlipFiles]     = useState({});   // courseId → File
  const [uploading, setUploading]     = useState({});   // courseId → progress 0-100
  const [uploaded, setUploaded]       = useState({});   // courseId → downloadURL
  const [buyLoading, setBuyLoading]   = useState({});

  const handleSlipChange = (courseId, file) => {
    setSlipFiles(p => ({ ...p, [courseId]: file }));
  };

  const handleBuy = async (course) => {
    setBuyLoading(p => ({ ...p, [course.id]: true }));
    try {
      let slipUrl = null;

      if (slipFiles[course.id]) {
        // Upload slip to Firebase Storage: slips/{userId}/{studentId}_{courseId}_slip.ext
        const file     = slipFiles[course.id];
        const ext      = file.name.split('.').pop();
        const sid      = userData?.studentId || user.uid.slice(0, 8);
        const fileName = `${sid}_${course.id}_slip.${ext}`;
        const storageRef = ref(storage, `slips/${user.uid}/${fileName}`);
        const task       = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          task.on('state_changed',
            snap => {
              const pct = Math.round(snap.bytesTransferred / snap.totalBytes * 100);
              setUploading(p => ({ ...p, [course.id]: pct }));
            },
            reject,
            async () => {
              slipUrl = await getDownloadURL(task.snapshot.ref);
              setUploaded(p => ({ ...p, [course.id]: slipUrl }));
              resolve();
            }
          );
        });
      }

      await buyNow(course, slipUrl);
    } catch (err) {
      console.error('Buy error:', err);
    }
    setBuyLoading(p => ({ ...p, [course.id]: false }));
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
          <Button variant="contained" onClick={() => navigate('/dashboard-lms/courses')}
            sx={{ borderRadius: '12px', textTransform: 'none', mt: 2 }}>
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cart.map(course => (
            <Card key={course.id} sx={{
              borderRadius: '16px', border: '1px solid #f1f5f9',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                {/* ── Course row ── */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <Avatar src={course.thumbnail} variant="rounded"
                    sx={{ width: 72, height: 54, borderRadius: '10px' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                      {course.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {course.teacher}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                      Rs. {course.price.toLocaleString()}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(course.id)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* ── Upload slip ── */}
                <Box sx={{
                  p: 2, borderRadius: '12px', bgcolor: '#F8FAFC',
                  border: '1px dashed #e2e8f0', mb: 1.5
                }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', mb: 1 }}>
                    📎 Upload Payment Slip (optional but recommended)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined" size="small"
                      component="label"
                      startIcon={<UploadFileRoundedIcon />}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontSize: '0.78rem' }}
                    >
                      {slipFiles[course.id] ? slipFiles[course.id].name : 'Choose File'}
                      <input type="file" hidden accept="image/*,.pdf"
                        onChange={e => handleSlipChange(course.id, e.target.files[0])} />
                    </Button>
                    {uploaded[course.id] && (
                      <CheckCircleRoundedIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
                    )}
                  </Box>
                  {uploading[course.id] > 0 && uploading[course.id] < 100 && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress variant="determinate" value={uploading[course.id]}
                        sx={{ borderRadius: 4 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 0.5 }}>
                        Uploading… {uploading[course.id]}%
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* ── Buy button ── */}
                <Button
                  fullWidth variant="contained"
                  onClick={() => handleBuy(course)}
                  disabled={!!buyLoading[course.id]}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                  {buyLoading[course.id] ? 'Processing…' : `Buy Now — Rs. ${course.price.toLocaleString()}`}
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* ── Total ── */}
          <Card sx={{ borderRadius: '16px', bgcolor: '#F8FAFC', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563EB' }}>
                  Rs. {cartTotal.toLocaleString()}
                </Typography>
              </Box>
              <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.78rem' }}>
                After payment, your enrollment will be reviewed and approved within 24 hours.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}