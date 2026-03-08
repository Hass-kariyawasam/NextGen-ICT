import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Chip,
  Button, Avatar, Divider
} from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { mockCourses, mockSchedule, mockNotices } from '../../data/mockCourses';
import CourseCard from '../../components/dashboard/CourseCard';

const scheduleColors = {
  live: { bg: '#DBEAFE', color: '#1D4ED8', dot: '#2563EB' },
  exam: { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  practical: { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
};

const noticeColors = {
  info: '#DBEAFE', warning: '#FEF3C7', success: '#D1FAE5'
};

export default function DashboardHome() {
  const { currentUser, userData } = useAuth();
  const { enrolledCourses } = useCart();
  const navigate = useNavigate();

  const displayName = userData?.name || currentUser?.displayName || 'Student';
  const myLessons = mockCourses.filter(c => enrolledCourses.includes(c.id));
  const upcomingSchedule = mockSchedule.slice(0, 4);

  return (
    <Box>
      {/* Welcome Banner */}
      <Card sx={{
        mb: 3, borderRadius: '20px',
        background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #06B6D4 100%)',
        color: '#fff', overflow: 'hidden', position: 'relative',
        boxShadow: '0 8px 32px rgba(37,99,235,0.3)'
      }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', opacity: 0.85, mb: 0.5 }}>
                Welcome back 👋
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 800, mb: 1 }}>
                {displayName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<EmojiEventsRoundedIcon sx={{ color: '#FCD34D !important', fontSize: '1rem !important' }} />}
                  label="A/L Exam: 365 days to go"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, border: 'none' }}
                />
                <Chip
                  icon={<TrendingUpRoundedIcon sx={{ color: '#6EE7B7 !important', fontSize: '1rem !important' }} />}
                  label={`${myLessons.length} Courses Enrolled`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, border: 'none' }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard-lms/courses')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                color: '#fff', borderRadius: '12px', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                textTransform: 'none'
              }}
            >
              Browse Courses →
            </Button>
          </Box>
        </CardContent>
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', right: -40, top: -40,
          width: 180, height: 180, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.06)'
        }} />
        <Box sx={{
          position: 'absolute', right: 40, bottom: -60,
          width: 140, height: 140, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.06)'
        }} />
      </Card>

      {/* My Lessons */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
            My Lessons
          </Typography>
          <Button
            size="small" onClick={() => navigate('/dashboard-lms/my-courses')}
            sx={{ textTransform: 'none', color: '#2563EB', fontWeight: 600 }}
          >
            View All →
          </Button>
        </Box>
        {myLessons.length === 0 ? (
          <Card sx={{
            borderRadius: '16px', border: '2px dashed #e2e8f0',
            boxShadow: 'none', p: 4, textAlign: 'center'
          }}>
            <Typography sx={{ color: '#94a3b8', mb: 2 }}>
              You haven't enrolled in any courses yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard-lms/courses')}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
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

      {/* Bottom Row: Calendar + Schedule + Notices */}
      <Grid container spacing={3}>
        {/* Schedule */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            border: '1px solid #f1f5f9', height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', mb: 2 }}>
                📅 Upcoming Schedule
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {upcomingSchedule.map(event => {
                  const style = scheduleColors[event.type] || scheduleColors.live;
                  return (
                    <Box key={event.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      p: 1.5, borderRadius: '12px', bgcolor: style.bg
                    }}>
                      <Box sx={{
                        width: 8, height: 8, borderRadius: '50%',
                        bgcolor: style.dot, flexShrink: 0
                      }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>
                          {event.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {event.date} • {event.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{ bgcolor: 'transparent', color: style.color, fontWeight: 600, fontSize: '0.7rem', border: 'none' }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notices */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            border: '1px solid #f1f5f9', height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', mb: 2 }}>
                🔔 Notices
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {mockNotices.map(notice => (
                  <Box key={notice.id} sx={{
                    p: 2, borderRadius: '12px',
                    bgcolor: noticeColors[notice.type] || '#F8FAFC',
                    borderLeft: `3px solid ${notice.type === 'info' ? '#3B82F6' : notice.type === 'warning' ? '#F59E0B' : '#10B981'}`
                  }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', mb: 0.5 }}>
                      {notice.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {notice.message}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 0.5 }}>
                      {notice.date}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}