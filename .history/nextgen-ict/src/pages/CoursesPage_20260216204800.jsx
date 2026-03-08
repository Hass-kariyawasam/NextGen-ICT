import React, { useState } from 'react';
import {
  Box, Grid, Typography, TextField, InputAdornment,
  Chip, Stack
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { mockCourses } from '../../data/mockCourses';
import CourseCard from '../../components/dashboard/CourseCard';

const categories = ['All', 'Theory', 'Programming', 'Web', 'Database', 'Networking', 'Free'];

export default function CoursesPage({ filter }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(filter || 'All');

  const filtered = mockCourses.filter(course => {
    const matchCat = activeCategory === 'All' || course.category === activeCategory;
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>
        Courses
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', mb: 3 }}>
        Browse all available courses and enroll to start learning.
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: '#94a3b8' }} />
            </InputAdornment>
          ),
          sx: { borderRadius: '12px', bgcolor: '#fff' }
        }}
        sx={{ mb: 2.5 }}
      />

      {/* Category Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {categories.map(cat => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setActiveCategory(cat)}
            sx={{
              borderRadius: '10px',
              bgcolor: activeCategory === cat ? '#2563EB' : '#fff',
              color: activeCategory === cat ? '#fff' : '#64748b',
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeCategory === cat ? '#2563EB' : '#e2e8f0',
              '&:hover': { bgcolor: activeCategory === cat ? '#1D4ED8' : '#F8FAFC' },
              cursor: 'pointer'
            }}
          />
        ))}
      </Stack>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '1rem' }}>
            No courses found. Try a different search.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map(course => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}