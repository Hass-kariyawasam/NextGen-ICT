import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent,
  Chip, Button, Skeleton
} from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { mockCourses } from '../../data/mockCourses';
import CourseCard from '../../components/dashboard/CourseCard';
import ExamCountdownWidget from '../../components/dashboard/ExamCountdownWidget';
import { ScheduleWidget, NoticesWidget } from '../../components/dashboard/ScheduleNoticesWidgets';

export default function DashboardHome() {
  const { user, userData } = useAuth();
  const { enrollments, loadingEnrollments } = useCart();
  const navigate = useNavigate();

  // Safe fallbacks
  const displayName = userData?.name || user?.displayName || 'Student';
  const firstName = displayName.split(' ')[0];
  const safeEnrolled = Array.isArray(enrollments) ? enrollments : [];

  // Only show approved courses
  const approvedIds = safeEnrolled
    .filter(e => e?.status === 'approved')
    .map(e => e?.courseId)
    .filter(Boolean);

  const myLessons = mockCourses.filter(c => approvedIds.includes(c.id));
  const totalEnrolled = safeEnrolled.length;

  return (
    <Box>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 55%, #06B6D4 100%)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(37,99,235,0.28)',
          border: 'none'
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.85rem', opacity: 0.8, mb: 0.5 }}>
                Welcome back 👋
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 800, mb: 1.5 }}>
                {firstName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={
                    <EmojiEventsRoundedIcon
                      sx={{ color: '#FCD34D !important', fontSize: '1rem !important' }}
                    />
                  }
                  label={`${totalEnrolled} Course${totalEnrolled !== 1 ? 's' : ''} Enrolled`}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    fontSize: '0.78rem'
                  }}
                />
                <Chip
                  icon={
                    <TrendingUpRoundedIcon
                      sx={{ color: '#6EE7B7 !important', fontSize: '1rem !important' }}
                    />
                  }
                  label="On Track"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    fontSize: '0.78rem'
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard-lms/courses')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                boxShadow: 'none'
              }}
            >
              Browse Courses →
            </Button>
          </Box>
        </CardContent>
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            right: -50,
            top: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 30,
            bottom: -70,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none'
          }}
        />
      </Card>

      {/* Widgets Row: Exam Countdown, Schedule, Notices */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ExamCountdownWidget />
        </Grid>
        <Grid item xs={12} md={4}>
          <ScheduleWidget />
        </Grid>
        <Grid item xs={12} md={4}>
          <NoticesWidget />
        </Grid>
      </Grid>

      {/* My Lessons */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
            My Lessons
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/dashboard-lms/my-courses')}
            sx={{ textTransform: 'none', color: '#2563EB', fontWeight: 600, fontSize: '0.82rem' }}
          >
            View All →
          </Button>
        </Box>

        {loadingEnrollments ? (
          <Grid container spacing={2}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={260} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        ) : myLessons.length === 0 ? (
          <Card
            sx={{
              borderRadius: '16px',
              border: '2px dashed #e2e8f0',
              boxShadow: 'none',
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              bgcolor: 'transparent'
            }}
          >
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📚</Typography>
            <Typography sx={{ color: '#64748b', mb: 2, fontSize: '0.9rem' }}>
              No approved courses yet. Buy a course to start learning!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard-lms/courses')}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
            >
              Browse Courses
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {myLessons.map(course => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}