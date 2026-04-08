import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  List,
  ListItem,
  CardMedia
} from '@mui/material';
import { motion } from 'framer-motion';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleRoundedIcon sx={{ fontSize: '1rem' }} />;
      case 'rejected': return <HighlightOffRoundedIcon sx={{ fontSize: '1rem' }} />;
      case 'pending': return <PendingRoundedIcon sx={{ fontSize: '1rem' }} />;
      default: return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: 'var(--lms-text)', mb: 1 }}>
            Order History
          </Typography>
          <Typography sx={{ color: 'var(--lms-text-secondary)', mb: 2 }}>
            Track the status of your course enrollment payments
          </Typography>
          <Divider />
        </Box>
      </motion.div>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'var(--lms-primary)' }} />
        </Box>
      ) : orders.length > 0 ? (
        <Grid container spacing={3}>
          {orders.map((order, idx) => (
            <Grid item xs={12} key={order.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  sx={{
                    borderRadius: '12px',
                    background: 'var(--lms-surface)',
                    border: '1px solid var(--lms-border)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'var(--lms-primary)',
                      boxShadow: '0 4px 12px rgba(0, 82, 204, 0.1)'
                    }
                  }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Order Number & Date */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Box>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-text-secondary)', fontWeight: 600 }}>
                            Order ID
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: 'var(--lms-text)', fontSize: '0.95rem' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-muted)', mt: 0.5 }}>
                            {new Date(order.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Number of Courses */}
                      <Grid item xs={12} sm={6} md={2}>
                        <Box>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-text-secondary)', fontWeight: 600 }}>
                            Courses
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: 'var(--lms-primary)', fontSize: '1.3rem' }}>
                            {order.courseCount || order.courses?.length || 0}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Total Amount */}
                      <Grid item xs={12} sm={6} md={2}>
                        <Box>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-text-secondary)', fontWeight: 600 }}>
                            Total Amount
                          </Typography>
                          <Typography sx={{ fontWeight: 900, color: 'var(--lms-accent)', fontSize: '1.1rem' }}>
                            Rs. {Number(order.totalAmount || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Status */}
                      <Grid item xs={12} sm={6} md={2}>
                        <Box>
                          <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-text-secondary)', fontWeight: 600 }}>
                            Status
                          </Typography>
                          <Chip
                            size="small"
                            label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            icon={getStatusIcon(order.status)}
                            color={getStatusColor(order.status)}
                            sx={{ fontWeight: 700, mt: 0.5 }}
                          />
                        </Box>
                      </Grid>

                      {/* View Button */}
                      <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="small"
                            endIcon={<OpenInNewRoundedIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            sx={{
                              color: 'var(--lms-primary)',
                              fontWeight: 700,
                              textTransform: 'none'
                            }}
                          >
                            View Details
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ borderRadius: '12px', p: 4, textAlign: 'center', background: 'var(--lms-surface)', border: '1px solid var(--lms-border)' }}>
          <EventRoundedIcon sx={{ fontSize: '3rem', color: 'var(--lms-text-secondary)', mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lms-text)', mb: 1 }}>
            No Orders Yet
          </Typography>
          <Typography sx={{ color: 'var(--lms-text-secondary)', mb: 3 }}>
            Add courses to your cart and submit payment to start your learning journey
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard-lms/courses')}>
            Browse Courses
          </Button>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: 'var(--lms-text)', fontSize: '1.2rem', pb: 1 }}>
              Order #{selectedOrder.id.slice(0, 8).toUpperCase()} Details
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              {/* Status Section */}
              <Box sx={{ mb: 3, p: 2, background: 'var(--lms-primary-soft)', borderRadius: '8px', textAlign: 'center' }}>
                <Box sx={{ mb: 1, fontSize: '2rem' }}>
                  {getStatusIcon(selectedOrder.status)}
                </Box>
                <Chip
                  label={selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ fontWeight: 700, mb: 1 }}
                />
                {selectedOrder.rejectionReason && (
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-error)', mt: 1 }}>
                    Reason: {selectedOrder.rejectionReason}
                  </Typography>
                )}
              </Box>

              {/* Order Details */}
              <Typography sx={{ fontWeight: 700, mb: 1.5, color: 'var(--lms-text)' }}>
                Order Information
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '0.9rem' }}>
                <Typography sx={{ color: 'var(--lms-text-secondary)' }}>Order Date:</Typography>
                <Typography sx={{ fontWeight: 600, color: 'var(--lms-text)' }}>
                  {new Date(selectedOrder.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontSize: '0.9rem' }}>
                <Typography sx={{ color: 'var(--lms-text-secondary)' }}>Total Amount:</Typography>
                <Typography sx={{ fontWeight: 900, color: 'var(--lms-primary)' }}>
                  Rs. {Number(selectedOrder.totalAmount || 0).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Courses List */}
              <Typography sx={{ fontWeight: 700, mb: 1.5, color: 'var(--lms-text)' }}>
                Courses ({selectedOrder.courseCount || selectedOrder.courses?.length || 0})
              </Typography>
              <List sx={{ p: 0 }}>
                {(selectedOrder.courses || []).map((course) => (
                  <ListItem key={course.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1, mb: 1 }}>
                    {course.thumbnail && (
                      <CardMedia
                        component="img"
                        image={course.thumbnail}
                        sx={{
                          width: '100%',
                          height: 80,
                          borderRadius: '6px',
                          objectFit: 'cover',
                          mb: 1
                        }}
                      />
                    )}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--lms-text)' }}>
                      {course.courseTitle || course.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-accent)', fontWeight: 700, mt: 0.5 }}>
                      Rs. {Number(course.price || 0).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              {/* Payment Slip Link */}
              {selectedOrder.slipLink && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1, color: 'var(--lms-text)' }}>
                      Payment Proof
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={<OpenInNewRoundedIcon />}
                      href={selectedOrder.slipLink}
                      target="_blank"
                      sx={{
                        color: 'var(--lms-primary)',
                        borderColor: 'var(--lms-border)',
                        fontWeight: 700,
                        textTransform: 'none'
                      }}
                    >
                      View Payment Slip
                    </Button>
                  </Box>
                </>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
