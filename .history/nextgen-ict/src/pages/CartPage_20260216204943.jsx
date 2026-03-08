import React from 'react';
import {
  Box, Typography, Card, CardContent, Button,
  Divider, Avatar, Chip, Alert
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, buyNow, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        My Cart
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 10, px: 2,
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
              borderRadius: '16px', border: '1px solid #f1f5f9',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar
                    src={course.thumbnail}
                    variant="rounded"
                    sx={{ width: 72, height: 56, borderRadius: '10px' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                      {course.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {course.teacher}
                    </Typography>
                    {course.status === 'pending_approval' && (
                      <Chip
                        icon={<PendingRoundedIcon sx={{ fontSize: '0.85rem !important' }} />}
                        label="Pending Approval"
                        size="small"
                        sx={{ mt: 0.5, bgcolor: '#FEF3C7', color: '#92400E', fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                      Rs. {course.price.toLocaleString()}
                    </Typography>
                    <Button
                      size="small" color="error"
                      startIcon={<DeleteRoundedIcon />}
                      onClick={() => removeFromCart(course.id)}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', mt: 0.5 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                {course.status !== 'pending_approval' && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      fullWidth variant="contained" size="small"
                      onClick={() => buyNow(course.id)}
                      sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                    >
                      Buy Now
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          <Divider />

          <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', bgcolor: '#F8FAFC', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563EB' }}>
                  Rs. {cartTotal.toLocaleString()}
                </Typography>
              </Box>
              <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.8rem' }}>
                After payment, your enrollment will be reviewed and approved within 24 hours.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}