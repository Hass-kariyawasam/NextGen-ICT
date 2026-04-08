import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { addToCart, isInCart, isEnrolled, isPending } = useCart();

  const enrolled = isEnrolled(course.id);
  const inCart = isInCart(course.id);
  const pending = isPending(course.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(course);
  };

  const handleViewCourse = () => {
    navigate(`/dashboard-lms/course-detail/${course.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      style={{ height: '100%' }}
    >
      <Card 
        className="lms-panel lms-card-uniform lms-grid-card" 
        sx={{ 
          p: 0, 
          borderRadius: '2px !important', 
          overflow: 'hidden', 
          cursor: 'pointer',
          background: 'var(--lms-surface)',
          border: '1px solid var(--lms-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            borderColor: 'var(--lms-primary)'
          }
        }} 
        onClick={handleViewCourse}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <CardMedia 
            component="img" 
            image={course.thumbnail} 
            alt={course.title} 
            sx={{ 
              height: 160, 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }} 
          />
          <Box sx={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))' 
          }} />
          <Chip 
            label={course.category} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              bgcolor: 'var(--lms-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem'
            }} 
          />
          {course.discountPercent > 0 && (
            <Chip 
              label={`${course.discountPercent}% OFF`} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                background: 'var(--lms-accent)',
                color: '#fff', 
                fontWeight: 700,
                fontSize: '0.7rem'
              }} 
            />
          )}
        </Box>

        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            className="lms-course-title" 
            sx={{ 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              color: 'var(--lms-text)', 
              mb: 0.8
            }}
          >
            {course.title}
          </Typography>
          <Typography 
            className="lms-course-description" 
            sx={{ 
              fontSize: '0.8rem', 
              color: 'var(--lms-text-secondary)', 
              mb: 1.5
            }}
          >
            {course.description}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 1.5, color: 'var(--lms-muted)', fontSize: '0.75rem' }}>
            <Stack direction="row" spacing={0.3} alignItems="center">
              <MenuBookRoundedIcon sx={{ fontSize: '0.9rem', color: 'var(--lms-primary)' }} />
              <span>{course.totalLessons} lessons</span>
            </Stack>
            <Stack direction="row" spacing={0.3} alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: '0.9rem', color: 'var(--lms-accent)' }} />
              <span>{course.duration || 'Flexible'}</span>
            </Stack>
          </Stack>

          <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', fontWeight: 600, mb: 1.5 }}>
            {course.teacher}
          </Typography>

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
            <Box>
              {course.originalPrice > course.price && (
                <Typography sx={{ fontSize: '0.7rem', color: 'var(--lms-muted)', textDecoration: 'line-through' }}>
                  Rs. {Number(course.originalPrice).toLocaleString()}
                </Typography>
              )}
              <Typography sx={{ 
                fontSize: '1rem', 
                fontWeight: 900, 
                color: 'var(--lms-primary)'
              }}>
                {Number(course.price) === 0 ? 'Free' : `Rs. ${Number(course.price || 0).toLocaleString()}`}
              </Typography>
            </Box>

            {enrolled ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  startIcon={<PlayCircleRoundedIcon />}
                  size="small"
                  onClick={(e) => { e.stopPropagation(); navigate(`/dashboard-lms/course/${course.id}`); }} 
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none', 
                    fontWeight: 700,
                    background: 'var(--lms-primary)',
                    fontSize: '0.75rem',
                    py: 0.8,
                    '&:hover': {
                      background: 'var(--lms-primary-dark)'
                    }
                  }}
                >
                  Open
                </Button>
              </motion.div>
            ) : pending ? (
              <Button 
                variant="outlined" 
                startIcon={<PendingRoundedIcon />} 
                disabled
                size="small"
                sx={{ 
                  borderRadius: '8px', 
                  textTransform: 'none', 
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  py: 0.8
                }}
              >
                Pending
              </Button>
            ) : inCart ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CheckCircleRoundedIcon />} 
                  size="small"
                  onClick={(e) => { e.stopPropagation(); navigate('/dashboard-lms/cart'); }} 
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none', 
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    py: 0.8,
                    borderColor: 'var(--lms-primary)',
                    color: 'var(--lms-primary)',
                    '&:hover': {
                      background: 'var(--lms-primary-soft)',
                      borderColor: 'var(--lms-primary)'
                    }
                  }}
                >
                  In Cart
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  startIcon={<ShoppingCartRoundedIcon />}
                  size="small"
                  onClick={handleAddToCart}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none', 
                    fontWeight: 700,
                    background: 'var(--lms-primary)',
                    fontSize: '0.75rem',
                    py: 0.8,
                    '&:hover': {
                      background: 'var(--lms-primary-dark)'
                    }
                  }}
                >
                  Add to Card
                </Button>
              </motion.div>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
