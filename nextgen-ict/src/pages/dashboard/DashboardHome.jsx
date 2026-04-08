import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase/config';
import { mockCourses } from '../../data/mockCourses';
import { normalizeCourse } from '../../utils/courseHelpers';
import CourseCard from '../../components/dashboard/CourseCard';
import ExamCountdownWidget from '../../components/dashboard/ExamCountdownWidget';
import { NoticesWidget, ScheduleWidget } from '../../components/dashboard/ScheduleNoticesWidgets';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { enrollments, loadingEnrollments } = useCart();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        if (snapshot.empty) setCourses(mockCourses.map(normalizeCourse));
        else setCourses(snapshot.docs.map((doc) => normalizeCourse({ id: doc.id, ...doc.data() })));
      },
      () => setCourses(mockCourses.map(normalizeCourse))
    );
    return () => unsub();
  }, []);

  const approvedIds = useMemo(
    () => enrollments.filter((item) => item.status === 'approved').map((item) => item.courseId),
    [enrollments]
  );

  const myCourses = useMemo(() => courses.filter((course) => approvedIds.includes(course.id)), [approvedIds, courses]);
  const displayName = userData?.name || user?.displayName || 'Student';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%' }}>
      <motion.div variants={itemVariants}>
        <Card 
          className="lms-panel" 
          sx={{ 
            borderRadius: '12px !important', 
            mb: 3, 
            background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)',
            color: '#fff',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5, lg: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={8}>
                <Typography sx={{ fontSize: '0.85rem', opacity: 0.9, mb: 1, fontWeight: 600, letterSpacing: 0.5 }}>WELCOME BACK</Typography>
                <Typography sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 900, mb: 1.5, lineHeight: 1.2 }}>
                  {displayName}
                </Typography>
                <Typography sx={{ maxWidth: 720, opacity: 0.92, lineHeight: 1.8, fontSize: '0.95rem' }}>
                  Continue learning, track your progress, and stay updated with announcements.
                </Typography>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}>
                  {[{ label: 'Active Courses', value: approvedIds.length }, { label: 'Total Enrollments', value: enrollments.length }].map((item) => (
                    <Box key={item.label} sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, mb: 0.5 }}>{item.value}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6} lg={4}><ExamCountdownWidget /></Grid>
          <Grid item xs={12} md={6} lg={4}><ScheduleWidget /></Grid>
          <Grid item xs={12} md={6} lg={4}><NoticesWidget /></Grid>
        </Grid>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lms-text)' }}>My Courses</Typography>
            <Typography sx={{ color: 'var(--lms-text-secondary)', fontSize: '0.9rem', mt: 0.5 }}>Continue your learning journey</Typography>
          </Box>
          <Button 
            onClick={() => navigate('/dashboard-lms/my-courses')} 
            endIcon={<ArrowRightRoundedIcon />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0052cc, #0066ff)',
              color: '#fff',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #0066ff, #0052cc)',
              }
            }}
          >
            View all
          </Button>
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        {loadingEnrollments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: 'var(--lms-primary)' }} /></Box>
        ) : myCourses.length ? (
          <Grid container spacing={2.5}>
            {myCourses.slice(0, 6).map((course, idx) => (
              <Grid item xs={12} sm={6} lg={4} key={course.id}>
                <motion.div
                  variants={itemVariants}
                  transition={{ delay: idx * 0.05 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="lms-panel" sx={{ borderRadius: '12px !important', py: 10, textAlign: 'center' }}>
              <CardContent>
                <Typography sx={{ fontWeight: 800, color: 'var(--lms-text)', mb: 1, fontSize: '1.1rem' }}>No Active Courses Yet</Typography>
                <Typography sx={{ color: 'var(--lms-text-secondary)', mb: 3 }}>Start your learning journey</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/dashboard-lms/courses')} 
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0052cc, #0066ff)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Explore Courses
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
