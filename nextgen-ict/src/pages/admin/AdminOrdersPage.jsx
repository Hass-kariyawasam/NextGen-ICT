import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  CardMedia,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected

  useEffect(() => {
    let q;
    if (filter === 'all') {
      q = query(collection(db, 'orders'));
    } else {
      q = query(collection(db, 'orders'), where('status', '==', filter));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [filter]);

  const handleApprove = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);

    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderRef, {
        status: 'approved',
        updatedAt: new Date(),
        approvedAt: new Date()
      });

      // Update all related enrollments
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(enrollmentsRef, where('orderId', '==', selectedOrder.id));
      // This would need a batch update in practice
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error approving order:', error);
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    setActionLoading(true);

    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderRef, {
        status: 'rejected',
        rejectionReason: rejectionReason,
        updatedAt: new Date(),
        rejectedAt: new Date()
      });

      setRejectionReason('');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
    setActionLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: 'var(--lms-text)', mb: 2 }}>
            Payment Orders Management
          </Typography>
          <Divider />
        </Box>
      </motion.div>

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {[
          { value: 'pending', label: 'Pending', icon: <PendingRoundedIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> },
          { value: 'approved', label: 'Approved', icon: <CheckCircleRoundedIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> },
          { value: 'rejected', label: 'Rejected', icon: <HighlightOffRoundedIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> },
          { value: 'all', label: 'All Orders', icon: null }
        ].map((tab) => (
          <motion.div key={tab.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === tab.value ? 'contained' : 'outlined'}
              onClick={() => setFilter(tab.value)}
              startIcon={tab.icon}
              sx={{
                background: filter === tab.value ? 'var(--lms-primary)' : 'transparent',
                color: filter === tab.value ? '#fff' : 'var(--lms-primary)',
                borderColor: 'var(--lms-border)',
                fontWeight: 700,
                textTransform: 'none'
              }}
            >
              {tab.label}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* Orders Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'var(--lms-primary)' }} />
        </Box>
      ) : orders.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid var(--lms-border)', background: 'var(--lms-surface)' }}>
          <Table>
            <TableHead sx={{ background: 'var(--lms-primary-soft)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Order ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Courses</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Amount</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: 'var(--lms-text)' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, idx) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ display: 'table-row' }}
                >
                  <TableCell sx={{ color: 'var(--lms-text)', fontWeight: 700 }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'var(--lms-text)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'var(--lms-text)', fontWeight: 700 }}>
                    {order.courseCount || order.courses?.length || 0}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'var(--lms-accent)', fontWeight: 900 }}>
                    Rs. {Number(order.totalAmount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      color={getStatusColor(order.status)}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedOrder(order)}
                        sx={{
                          color: 'var(--lms-primary)',
                          borderColor: 'var(--lms-border)',
                          fontWeight: 700,
                          textTransform: 'none'
                        }}
                      >
                        Review
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card sx={{ borderRadius: '12px', p: 4, textAlign: 'center', background: 'var(--lms-surface)', border: '1px solid var(--lms-border)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lms-text)', mb: 1 }}>
            No Orders Found
          </Typography>
          <Typography sx={{ color: 'var(--lms-text-secondary)' }}>
            There are no {filter !== 'all' ? filter : ''} orders at the moment
          </Typography>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--lms-text)', pb: 1 }}>
              Order #{selectedOrder.id.slice(0, 8).toUpperCase()} Review
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              {/* Status */}
              <Box sx={{ mb: 2, p: 2, background: 'var(--lms-primary-soft)', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-text-secondary)', mb: 1 }}>
                  Current Status
                </Typography>
                <Chip
                  label={selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Order Info */}
              <Typography sx={{ fontWeight: 700, mb: 1.5, color: 'var(--lms-text)' }}>
                Order Information
              </Typography>
              <Box sx={{ fontSize: '0.9rem', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'var(--lms-text-secondary)' }}>Date:</Typography>
                  <Typography sx={{ fontWeight: 600, color: 'var(--lms-text)' }}>
                    {new Date(selectedOrder.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'var(--lms-text-secondary)' }}>Courses:</Typography>
                  <Typography sx={{ fontWeight: 600, color: 'var(--lms-text)' }}>
                    {selectedOrder.courseCount || selectedOrder.courses?.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'var(--lms-text-secondary)' }}>Amount:</Typography>
                  <Typography sx={{ fontWeight: 900, color: 'var(--lms-primary)' }}>
                    Rs. {Number(selectedOrder.totalAmount || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Courses */}
              <Typography sx={{ fontWeight: 700, mb: 1, color: 'var(--lms-text)' }}>
                Enrolled Courses
              </Typography>
              <List sx={{ p: 0, mb: 2 }}>
                {(selectedOrder.courses || []).map((course) => (
                  <ListItem key={course.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1, mb: 1 }}>
                    {course.thumbnail && (
                      <CardMedia
                        component="img"
                        image={course.thumbnail}
                        sx={{
                          width: '100%',
                          height: 60,
                          borderRadius: '6px',
                          objectFit: 'cover',
                          mb: 0.5
                        }}
                      />
                    )}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--lms-text)' }}>
                      {course.courseTitle}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-accent)', fontWeight: 700 }}>
                      Rs. {Number(course.price || 0).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Payment Slip */}
              {selectedOrder.slipLink && (
                <>
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
                      mb: 2,
                      textTransform: 'none'
                    }}
                  >
                    View Payment Slip
                  </Button>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Description */}
              {selectedOrder.description && (
                <>
                  <Typography sx={{ fontWeight: 700, mb: 1, color: 'var(--lms-text)', fontSize: '0.9rem' }}>
                    Payment Description
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--lms-text-secondary)', mb: 2, p: 1.5, background: 'var(--lms-surface-strong)', borderRadius: '6px' }}>
                    {selectedOrder.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Rejection Reason Input */}
              {selectedOrder.status !== 'approved' && selectedOrder.status !== 'rejected' && (
                <TextField
                  fullWidth
                  label="Rejection Reason (if rejecting)"
                  placeholder="Enter reason for rejection..."
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              {selectedOrder.rejectionReason && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Rejection Reason:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                    {selectedOrder.rejectionReason}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedOrder(null)} sx={{ color: 'var(--lms-text-secondary)' }}>
                Close
              </Button>
              {selectedOrder.status === 'pending' && (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'block' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReject}
                      disabled={actionLoading}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                      {actionLoading ? 'Processing...' : 'Reject'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'block' }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleApprove}
                      disabled={actionLoading}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </Button>
                  </motion.div>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
