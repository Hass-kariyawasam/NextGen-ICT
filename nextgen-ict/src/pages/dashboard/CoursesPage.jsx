import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import CourseCard from '../../components/dashboard/CourseCard';
import { db } from '../../firebase/config';
import { mockCourses } from '../../data/mockCourses';
import { normalizeCourse } from '../../utils/courseHelpers';

const CATEGORIES = ['All', 'Theory', 'Programming', 'Web', 'Database', 'Networking', 'Free'];

export default function CoursesPage({ filter = 'All' }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(filter === 'All' ? 'All' : filter);

  useEffect(() => {
    setCategory(filter === 'All' ? 'All' : filter);
  }, [filter]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        if (snapshot.empty) {
          setCourses(mockCourses.map(normalizeCourse));
        } else {
          setCourses(snapshot.docs.map((doc) => normalizeCourse({ id: doc.id, ...doc.data() })));
        }
        setLoading(false);
      },
      () => {
        setCourses(mockCourses.map(normalizeCourse));
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const visibleCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = category === 'All' || course.category === category;
      const haystack = [course.title, course.description, course.teacher, course.shortTitle].join(' ').toLowerCase();
      const matchesSearch = !keyword || haystack.includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [courses, search, category]);

  return (
    <Box>
      <Box className="lms-page-head">
        <Box>
          <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>Explore Courses</Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>
            Browse all available courses and open any course to view lesson details.
          </Typography>
        </Box>
      </Box>

      <Box className="lms-panel" sx={{ borderRadius: 5, p: { xs: 2, sm: 2.5 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by course title, teacher, or topic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {visibleCourses.map((course) => (
            <Grid item xs={12} sm={6} xl={4} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
          {!visibleCourses.length && (
            <Grid item xs={12}>
              <Box className="lms-panel" sx={{ borderRadius: 5, py: 10, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.75 }}>No courses found</Typography>
                <Typography sx={{ color: '#64748b' }}>Adjust the search or filter to see more courses.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
