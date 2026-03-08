import React from 'react';
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Box, Chip
} from '@mui/material';
import PlayCircleRoundedIcon     from '@mui/icons-material/PlayCircleRounded';
import ShoppingCartRoundedIcon   from '@mui/icons-material/ShoppingCartRounded';
import CheckCircleRoundedIcon    from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon        from '@mui/icons-material/PendingRounded';
import AccessTimeRoundedIcon     from '@mui/icons-material/AccessTimeRounded';
import LocalOfferRoundedIcon     from '@mui/icons-material/LocalOfferRounded';
import { useNavigate } from 'react-router-dom';
import { useCart }     from '../../context/CartContext';

const CAT_COLORS = {
  Theory:      { bg: '#EFF6FF', color: '#1D4ED8' },
  Programming: { bg: '#F0FDF4', color: '#15803D' },
  Web:         { bg: '#FFF7ED', color: '#C2410C' },
  Database:    { bg: '#F5F3FF', color: '#6D28D9' },
  Networking:  { bg: '#FFF1F2', color: '#BE123C' },
  Free:        { bg: '#ECFDF5', color: '#065F46' },
};

export default function CourseCard({ course }) {
  const navigate                          = useNavigate();
  const { addToCart, isInCart, isEnrolled, isPending } = useCart();

  const enrolled  = isEnrolled(course.id);
  const inCart    = isInCart(course.id);
  const pending   = isPending(course.id);
  const cat       = CAT_COLORS[course.category] || { bg: '#F8FAFC', color: '#475569' };

  // discount helpers
  const hasDiscount    = Boolean(course.originalPrice && course.originalPrice > course.price);
  const discountPct    = hasDiscount
    ? Math.round((1 - course.price / course.originalPrice) * 100) : 0;

  return (
    <Card
      onClick={() => navigate(`/dashboard-lms/course/${course.id}`)}
      sx={{
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.12)', transform: 'translateY(-3px)' },
      }}
    >
      {/* ── Thumbnail ── */}
      <Box sx={{ position: 'relative', paddingBottom: '55%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={course.thumbnail}
          alt={course.title}
          sx={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
          }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)'
        }} />

        {/* Category badge */}
        <Chip label={course.category} size="small" sx={{
          position: 'absolute', top: 10, left: 10,
          bgcolor: cat.bg, color: cat.color, fontWeight: 600, fontSize: '0.68rem'
        }} />

        {/* Free / Discount badge */}
        {course.price === 0 ? (
          <Chip label="FREE" size="small" sx={{
            position: 'absolute', top: 10, right: 10,
            bgcolor: '#10B981', color: '#fff', fontWeight: 700, fontSize: '0.68rem'
          }} />
        ) : hasDiscount && (
          <Chip
            icon={<LocalOfferRoundedIcon sx={{ fontSize: '0.75rem !important', color: '#fff !important' }} />}
            label={`${discountPct}% OFF`}
            size="small"
            sx={{
              position: 'absolute', top: 10, right: 10,
              bgcolor: '#EF4444', color: '#fff', fontWeight: 700, fontSize: '0.68rem'
            }}
          />
        )}
      </Box>

      {/* ── Body ── */}
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Typography sx={{
          fontWeight: 700, fontSize: '0.92rem', color: '#1e293b', mb: 0.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4
        }}>
          {course.title}
        </Typography>

        <Typography sx={{
          fontSize: '0.775rem', color: '#94a3b8', mb: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {course.description}
        </Typography>

        <Typography sx={{ fontSize: '0.775rem', color: '#64748b', mb: 1, fontWeight: 500 }}>
          👨‍🏫 {course.teacher}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlayCircleRoundedIcon sx={{ fontSize: '0.85rem', color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
              {course.totalLessons} lessons
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: '0.85rem', color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
              {course.duration}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* ── Actions ── */}
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        {enrolled ? (
          <Button
            fullWidth variant="contained" size="small"
            startIcon={<PlayCircleRoundedIcon />}
            onClick={e => { e.stopPropagation(); navigate(`/dashboard-lms/course/${course.id}`); }}
            sx={{ borderRadius: '10px', textTransform: 'none', bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
          >
            Continue Learning
          </Button>

        ) : pending ? (
          <Button fullWidth variant="outlined" size="small" disabled
            startIcon={<PendingRoundedIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none', borderColor: '#F59E0B', color: '#92400E' }}
          >
            Pending Approval
          </Button>

        ) : inCart ? (
          <Button
            fullWidth variant="outlined" size="small"
            startIcon={<CheckCircleRoundedIcon />}
            onClick={e => { e.stopPropagation(); navigate('/dashboard-lms/cart'); }}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            View in Cart
          </Button>

        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              {hasDiscount && (
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', textDecoration: 'line-through', lineHeight: 1 }}>
                  Rs. {course.originalPrice?.toLocaleString()}
                </Typography>
              )}
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.2 }}>
                {course.price === 0 ? 'Free' : `Rs. ${course.price.toLocaleString()}`}
              </Typography>
            </Box>
            <Button
              variant="contained" size="small"
              startIcon={<ShoppingCartRoundedIcon />}
              onClick={e => { e.stopPropagation(); addToCart(course); }}
              sx={{
                borderRadius: '10px', textTransform: 'none',
                fontSize: '0.75rem', whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
              }}
            >
              Add to Cart
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}