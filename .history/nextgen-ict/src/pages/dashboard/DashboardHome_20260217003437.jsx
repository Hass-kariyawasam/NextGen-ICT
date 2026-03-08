import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent,
  Chip, Button, Skeleton
} from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TrendingUpRoundedIcon  from '@mui/icons-material/TrendingUpRounded';
import { useNavigate }        from 'react-router-dom';
import { useAuth }            from '../../context/AuthContext';
import { useCart }            from '../../context/CartContext';
import { mockCourses, mockSchedule, mockNotices } from '../../data/mockCourses';
import CourseCard             from '../../components/dashboard/CourseCard';
import ExamCountdownWidget from '../../components/dashboard/ExamCountdownWidget';
import { ScheduleWidget, NoticesWidget } from '../../components/dashboard/ScheduleNoticesWidgets';

const EXAM_DATE = new Date('2026-08-10');
const daysLeft  = () => Math.max(0, Math.ceil((EXAM_DATE - new Date()) / 86400000));

const SCHEDULE_COLORS = {
  live:      { bg: '#DBEAFE', color: '#1D4ED8', dot: '#2563EB' },
  exam:      { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  practical: { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
};

const NOTICE_BG     = { info: '#DBEAFE', warning: '#FEF3C7', success: '#D1FAE5' };
const NOTICE_BORDER = { info: '#3B82F6', warning: '#F59E0B', success: '#10B981' };

export default function DashboardHome() {
  const { user, userData }                  = useAuth();
  const { enrollments, loadingEnrollments } = useCart();
  const navigate                            = useNavigate();

  // ✅ Safe fallbacks — never crash on undefined
  const displayName  = userData?.name || user?.displayName || 'Student';
  const firstName    = displayName.split(' ')[0];
  const safeEnrolled = Array.isArray(enrollments) ? enrollments : [];

  // Only show approved ones in My Lessons
  const approvedIds  = safeEnrolled
    .filter(e => e?.status === 'approved')
    .map(e => e?.courseId)
    .filter(Boolean);

  const myLessons     = mockCourses.filter(c => approvedIds.includes(c.id));
  const totalEnrolled = safeEnrolled.length;

  return (
    <Box>
      {/* ── Welcome Banner ── */}
      <Card sx={{
        mb: 3, borderRadius: '20px',
        background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 55%, #06B6D4 100%)',
        color: '#fff', overflow: 'hidden', position: 'relative',
        boxShadow: '0 8px 32px rgba(37,99,235,0.28)', border: 'none',
      }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 2
          }}>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', opacity: 0.8, mb: 0.5 }}>
                Welcome back 👋
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 800, mb: 1.5 }}>
                {firstName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<EmojiEventsRoundedIcon sx={{ color: '#FCD34D !important', fontSize: '1rem !important' }} />}
                  label={`A/L Exam: ${daysLeft()} days`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, border: 'none', fontSize: '0.78rem' }}
                />
                <Chip
                  icon={<TrendingUpRoundedIcon sx={{ color: '#6EE7B7 !important', fontSize: '1rem !important' }} />}
                  label={`${totalEnrolled} Course${totalEnrolled !== 1 ? 's' : ''} Enrolled`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, border: 'none', fontSize: '0.78rem' }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard-lms/courses')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                color: '#fff', borderRadius: '12px', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)', textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, boxShadow: 'none',
              }}
            >
              Browse Courses →
            </Button>
          </Box>
        </CardContent>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', right: 30, bottom: -70, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      </Card>

      {/* ── My Lessons ── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
            My Lessons
          </Typography>
          <Button
            size="small" onClick={() => navigate('/dashboard-lms/my-courses')}
            sx={{ textTransform: 'none', color: '#2563EB', fontWeight: 600, fontSize: '0.82rem' }}
          >
            View All →
          </Button>
        </Box>

        {/* ✅ Loading state */}
        {loadingEnrollments ? (
          <Grid container spacing={2}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={260} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>

        ) : myLessons.length === 0 ? (
          <Card sx={{
            borderRadius: '16px', border: '2px dashed #e2e8f0',
            boxShadow: 'none', p: { xs: 3, sm: 5 }, textAlign: 'center', bgcolor: 'transparent'
          }}>
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

      {/* ── Schedule + Notices ── */}
      <Grid container spacing={3}>
        {/* Schedule */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', height: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', mb: 2 }}>
                📅 Upcoming Schedule
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {mockSchedule.slice(0, 4).map(event => {
                  const style = SCHEDULE_COLORS[event.type] || SCHEDULE_COLORS.live;
                  return (
                    <Box key={event.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      p: 1.5, borderRadius: '12px', bgcolor: style.bg,
                    }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: style.dot, flexShrink: 0 }} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {event.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.73rem', color: '#64748b' }}>
                          {event.date} • {event.time}
                        </Typography>
                      </Box>
                      <Chip label={event.type} size="small" sx={{ bgcolor: 'transparent', color: style.color, fontWeight: 600, fontSize: '0.68rem', border: 'none', flexShrink: 0 }} />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notices */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', height: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', mb: 2 }}>
                🔔 Notices
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {mockNotices.map(notice => (
                  <Box key={notice.id} sx={{
                    p: 2, borderRadius: '12px',
                    bgcolor: NOTICE_BG[notice.type]     || '#F8FAFC',
                    borderLeft: `3px solid ${NOTICE_BORDER[notice.type] || '#94a3b8'}`,
                  }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#1e293b', mb: 0.4 }}>
                      {notice.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                      {notice.message}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', mt: 0.5 }}>
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