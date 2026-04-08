import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Badge,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function FloatingCart() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    navigate('/dashboard-lms/payment-submission');
  };

  return (
    <>
      {/* Floating Cart Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 999 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Box
            onClick={() => setOpen(true)}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--lms-primary) 0%, #0066ff 100%)',
              borderRadius: '50%',
              width: 70,
              height: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 82, 204, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <Badge
              badgeContent={cart.length}
              sx={{
                '& .MuiBadge-badge': {
                  background: 'var(--lms-accent)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }
              }}
            >
              <ShoppingCartRoundedIcon sx={{ color: '#fff', fontSize: '1.8rem' }} />
            </Badge>
          </Box>
        </motion.div>
      </motion.div>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            background: 'var(--lms-surface)',
            borderLeft: '1px solid var(--lms-border)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--lms-border)' }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lms-text)' }}>
            My Card ({cart.length})
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: 'var(--lms-text)' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <AnimatePresence>
          {cart.length > 0 ? (
            <>
              <List sx={{ p: 2, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                {cart.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ display: 'block', marginBottom: 12 }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 1.5,
                        background: 'var(--lms-primary-soft)',
                        borderRadius: '8px',
                        border: '1px solid var(--lms-border)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(0, 82, 204, 0.12)',
                          borderColor: 'var(--lms-primary)'
                        }
                      }}
                    >
                      {course.thumbnail && (
                        <Box
                          component="img"
                          src={course.thumbnail}
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
                        {course.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', my: 0.5 }}>
                        {course.description?.substring(0, 60)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'var(--lms-primary)' }}>
                          Rs. {Number(course.price || 0).toLocaleString()}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(course.id)}
                          sx={{ color: 'var(--lms-error)' }}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid var(--lms-border)' }}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--lms-text)' }}>Total:</Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--lms-primary)' }}>
                    Rs. {Number(cartTotal).toLocaleString()}
                  </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, var(--lms-primary) 0%, #0066ff 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      mb: 1
                    }}
                    onClick={handleCheckout}
                  >
                    Proceed to Payment
                  </Button>
                </motion.div>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ShoppingCartRoundedIcon sx={{ fontSize: '3rem', color: 'var(--lms-text-secondary)', mb: 2 }} />
              <Typography sx={{ color: 'var(--lms-text-secondary)', fontWeight: 600 }}>
                Your card is empty
              </Typography>
              <Typography sx={{ color: 'var(--lms-muted)', fontSize: '0.85rem', mt: 1 }}>
                Add courses to get started
              </Typography>
            </Box>
          )}
        </AnimatePresence>
      </Drawer>
    </>
  );
}
