import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Dialog,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  CardMedia
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function PaymentSubmissionPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, submitPayment } = useCart();
  const [slipLink, setSlipLink] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: '12px', p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 2, color: 'var(--lms-text)' }}>
            Your card is empty
          </Typography>
          <Button onClick={() => navigate('/dashboard-lms/courses')} variant="contained">
            Continue Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slipLink.trim()) {
      setError('Please provide a payment slip link or upload link');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description/reference for the payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitPayment(slipLink, description);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard-lms/order-history');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/dashboard-lms/cart')}
          sx={{ mb: 3, color: 'var(--lms-primary)', fontWeight: 700 }}
        >
          Back to Cart
        </Button>
      </motion.div>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card sx={{ borderRadius: '12px', background: 'var(--lms-surface)', border: '1px solid var(--lms-border)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lms-text)', mb: 2 }}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List sx={{ p: 0 }}>
                  {cart.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ display: 'block' }}
                    >
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1.5, mb: 1 }}>
                        {course.thumbnail && (
                          <CardMedia
                            component="img"
                            image={course.thumbnail}
                            sx={{
                              width: '100%',
                              height: 100,
                              borderRadius: '8px',
                              objectFit: 'cover',
                              mb: 1
                            }}
                          />
                        )}
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--lms-text)' }}>
                          {course.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', my: 0.5 }}>
                          {course.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                          <Chip label={course.category} size="small" sx={{ background: 'var(--lms-primary-soft)' }} />
                          <Typography sx={{ fontWeight: 900, color: 'var(--lms-accent)' }}>
                            Rs. {Number(course.price || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--lms-text-secondary)' }}>
                    Number of Courses:
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: 'var(--lms-text)' }}>
                    {cart.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--lms-text-secondary)' }}>
                    Subtotal:
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--lms-text)' }}>
                    Rs. {Number(cartTotal).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, background: 'var(--lms-primary-soft)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--lms-border)' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-text-secondary)', mb: 0.5 }}>
                    Total Amount to Pay
                  </Typography>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--lms-primary)' }}>
                    Rs. {Number(cartTotal).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Payment Form */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card sx={{ borderRadius: '12px', background: 'var(--lms-surface)', border: '1px solid var(--lms-border)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lms-text)', mb: 1 }}>
                  Submit Payment
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-text-secondary)', mb: 2 }}>
                  Please provide your payment slip link and description for verification
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {success ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                      <CheckCircleRoundedIcon sx={{ fontSize: '4rem', color: 'var(--lms-success)', mb: 2 }} />
                    </motion.div>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lms-text)', mb: 1 }}>
                      Payment Submitted Successfully!
                    </Typography>
                    <Typography sx={{ color: 'var(--lms-text-secondary)', fontSize: '0.9rem' }}>
                      Redirecting to order history...
                    </Typography>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Payment Slip Link */}
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 1, color: 'var(--lms-text)' }}>
                        Payment Slip Link *
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', mb: 1 }}>
                        Share a Google Drive or Dropbox link to your payment proof/screenshot
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="https://drive.google.com/file/d/..."
                        value={slipLink}
                        onChange={(e) => setSlipLink(e.target.value)}
                        multiline
                        rows={3}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            background: 'var(--lms-input-bg)',
                            color: 'var(--lms-text)'
                          }
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 1, color: 'var(--lms-text)' }}>
                        Payment Description/Reference *
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', mb: 1 }}>
                        Include transaction ID, date, or any reference information
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., Transaction ID: TXN123456, Date: 29-03-2026"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            background: 'var(--lms-input-bg)',
                            color: 'var(--lms-text)'
                          }
                        }}
                      />
                    </Box>

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadRoundedIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, var(--lms-primary) 0%, #0066ff 100%)',
                          color: '#fff',
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          mt: 2
                        }}
                      >
                        {loading ? 'Submitting...' : 'Submit Payment'}
                      </Button>
                    </motion.div>

                    <Divider sx={{ my: 1 }} />

                    <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
                      After submitting, admin will review your payment and approve the courses within 24 hours.
                    </Alert>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}
