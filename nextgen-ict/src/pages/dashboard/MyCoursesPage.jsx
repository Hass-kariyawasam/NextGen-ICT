import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { mockCourses } from '../../data/mockCourses';
import CourseCard from '../../components/dashboard/CourseCard';

export default function MyCoursesPage() {
  const { enrolledCourses } = useCart();
  const navigate = useNavigate();
  const myCourses = mockCourses.filter(c => enrolledCourses.includes(c.id));

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        My Courses
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} enrolled
      </Typography>

      {myCourses.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 10, px: 2,
          border: '2px dashed #e2e8f0', borderRadius: '20px'
        }}>
          <Typography sx={{ fontSize: '2rem', mb: 2 }}>📚</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
            No Courses Yet
          </Typography>
          <Typography sx={{ color: '#94a3b8', mb: 3 }}>
            Browse our course catalog and start learning today.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard-lms/courses')}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {myCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}