import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import CourseCard from '../../components/dashboard/CourseCard';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase/config';
import { mockCourses } from '../../data/mockCourses';
import { normalizeCourse } from '../../utils/courseHelpers';

export default function MyCoursesPage() {
  const navigate = useNavigate();
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

  const approvedIds = useMemo(() => enrollments.filter((item) => item.status === 'approved').map((item) => item.courseId), [enrollments]);
  const myCourses = useMemo(() => courses.filter((course) => approvedIds.includes(course.id)), [courses, approvedIds]);

  return (
    <Box>
      <Box className="lms-page-head">
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>My Courses</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Courses that are already approved for your account.</Typography>
        </Box>
      </Box>

      {loadingEnrollments ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : myCourses.length ? (
        <Grid container spacing={2.5}>
          {myCourses.map((course) => (
            <Grid item xs={12} sm={6} xl={4} key={course.id}><CourseCard course={course} /></Grid>
          ))}
        </Grid>
      ) : (
        <Box className="lms-panel" sx={{ borderRadius: 5, py: 8, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>No courses available</Typography>
          <Typography sx={{ color: '#64748b', mb: 2 }}>Buy a course first and wait for admin approval.</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard-lms/courses')} sx={{ borderRadius: 3, textTransform: 'none' }}>Browse courses</Button>
        </Box>
      )}
    </Box>
  );
}
