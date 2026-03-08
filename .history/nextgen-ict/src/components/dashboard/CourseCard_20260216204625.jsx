import React from 'react';
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Box, Chip, Rating, Avatar
} from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const categoryColors = {
  Theory: { bg: '#EFF6FF', color: '#1D4ED8' },
  Programming: { bg: '#F0FDF4', color: '#15803D' },
  Web: { bg: '#FFF7ED', color: '#C2410C' },
  Database: { bg: '#F5F3FF', color: '#6D28D9' },
  Networking: { bg: '#FFF1F2', color: '#BE123C' },
  Free: { bg: '#ECFDF5', color: '#065F46' },
};

export default function CourseCard({ course, showEnrollButton = true }) {
  const navigate = useNavigate();
  const { addToCart, isInCart, isEnrolled } = useCart();
  const enrolled = isEnrolled(course.id);
  const inCart = isInCart(course.id);
  const catStyle = categoryColors[course.category] || { bg: '#F8FAFC', color: '#475569' };

  return (
    <Card sx={{
      borderRadius: '16px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
      },
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
      onClick={() => navigate(`/dashboard-lms/course/${course.id}`)}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.thumbnail}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
        }} />
        <Chip
          label={course.category}
          size="small"
          sx={{
            position: 'absolute', top: 10, left: 10,
            bgcolor: catStyle.bg, color: catStyle.color,
            fontWeight: 600, fontSize: '0.7rem', border: 'none',
          }}
        />
        {course.price === 0 && (
          <Chip
            label="FREE"
            size="small"
            sx={{
              position: 'absolute', top: 10, right: 10,
              bgcolor: '#10B981', color: '#fff',
              fontWeight: 700, fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Typography sx={{
          fontWeight: 700, fontSize: '0.95rem', color: '#1e293b',
          mb: 0.5, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {course.title}
        </Typography>

        <Typography sx={{
          fontSize: '0.78rem', color: '#94a3b8', mb: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {course.description}
        </Typography>

        <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 1, fontWeight: 500 }}>
          👨‍🏫 {course.teacher}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={course.rating} readOnly size="small" precision={0.1}
            sx={{ fontSize: '0.85rem' }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            {course.rating}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlayCircleRoundedIcon sx={{ fontSize: '0.9rem', color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              {course.totalLessons} lessons
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: '0.9rem', color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              {course.duration}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {showEnrollButton && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
          {enrolled ? (
            <Button
              fullWidth variant="contained" size="small"
              startIcon={<PlayCircleRoundedIcon />}
              onClick={(e) => { e.stopPropagation(); navigate(`/dashboard-lms/course/${course.id}`); }}
              sx={{
                borderRadius: '10px', textTransform: 'none',
                bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }
              }}
            >
              Continue Learning
            </Button>
          ) : inCart ? (
            <Button
              fullWidth variant="outlined" size="small"
              startIcon={<CheckCircleRoundedIcon />}
              disabled
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              In Cart
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                  {course.price === 0 ? 'Free' : `Rs. ${course.price.toLocaleString()}`}
                </Typography>
              </Box>
              <Button
                variant="contained" size="small"
                startIcon={<ShoppingCartRoundedIcon />}
                onClick={(e) => { e.stopPropagation(); addToCart(course); }}
                sx={{
                  borderRadius: '10px', textTransform: 'none',
                  fontSize: '0.78rem', whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                }}
              >
                Add to Cart
              </Button>
            </Box>
          )}
        </CardActions>
      )}
    </Card>
  );
}