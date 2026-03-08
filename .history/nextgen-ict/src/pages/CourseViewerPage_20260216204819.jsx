import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Card, CardContent, List,
  ListItem, ListItemButton, ListItemText, ListItemIcon,
  Chip, Button, Divider, Tab, Tabs, Alert
} from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { mockCourses } from '../../data/mockCourses';
import { useCart } from '../../context/CartContext';

export default function CourseViewerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, addToCart, isInCart } = useCart();
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const course = mockCourses.find(c => c.id === courseId);
  const enrolled = isEnrolled(courseId);

  if (!course) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#94a3b8' }}>Course not found.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  const currentLesson = activeLesson || (enrolled ? course.lessons[0] : null);

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none', color: '#64748b' }}
      >
        Back
      </Button>

      <Grid container spacing={3}>
        {/* Left: Video Player + Tabs */}
        <Grid item xs={12} md={8}>
          {/* Video */}
          <Card sx={{ borderRadius: '16px', overflow: 'hidden', mb: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            {enrolled && currentLesson ? (
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', bgcolor: '#000' }}>
                <iframe
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box sx={{
                position: 'relative', paddingBottom: '56.25%',
                bgcolor: '#1e293b', overflow: 'hidden'
              }}>
                <Box
                  component="img"
                  src={course.thumbnail}
                  sx={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', opacity: 0.4
                  }}
                />
                <Box sx={{
                  position: 'absolute', inset: 0, display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
                }}>
                  <LockRoundedIcon sx={{ fontSize: '3rem', color: '#fff' }} />
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                    Enroll to Watch
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => addToCart(course)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                  >
                    {isInCart(courseId) ? 'In Cart — Go to Cart' : `Add to Cart — Rs. ${course.price.toLocaleString()}`}
                  </Button>
                </Box>
              </Box>
            )}
          </Card>

          {/* Lesson Info */}
          {enrolled && currentLesson && (
            <Card sx={{ borderRadius: '16px', mb: 2, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
                  {currentLesson.title}
                </Typography>

                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                  <Tab label="Description" sx={{ textTransform: 'none' }} />
                  <Tab label="Notes" sx={{ textTransform: 'none' }} />
                  <Tab label="PDF" sx={{ textTransform: 'none' }} />
                </Tabs>

                {activeTab === 0 && (
                  <Typography sx={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>
                    {currentLesson.description}
                  </Typography>
                )}
                {activeTab === 1 && (
                  currentLesson.hasNotes ? (
                    <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px' }}>
                      <Typography sx={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600, mb: 1 }}>
                        📝 Lesson Notes
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.8 }}>
                        Notes for this lesson are available. Key concepts covered include the main topics from the video above. Review these alongside the video for best results.
                      </Typography>
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: '10px' }}>
                      No notes available for this lesson yet.
                    </Alert>
                  )
                )}
                {activeTab === 2 && (
                  currentLesson.hasPdf ? (
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfRoundedIcon />}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        Download Lesson PDF
                      </Button>
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: '10px' }}>
                      No PDF available for this lesson yet.
                    </Alert>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* Course Info (non-enrolled) */}
          {!enrolled && (
            <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e293b', mb: 1 }}>
                  {course.title}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 2, lineHeight: 1.7 }}>
                  {course.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={`👨‍🏫 ${course.teacher}`} sx={{ bgcolor: '#F8FAFC' }} />
                  <Chip label={`📚 ${course.totalLessons} Lessons`} sx={{ bgcolor: '#F8FAFC' }} />
                  <Chip label={`⏱ ${course.duration}`} sx={{ bgcolor: '#F8FAFC' }} />
                  <Chip label={`⭐ ${course.rating}/5`} sx={{ bgcolor: '#FFF7ED', color: '#C2410C' }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e293b' }}>
                    {course.price === 0 ? 'Free' : `Rs. ${course.price.toLocaleString()}`}
                  </Typography>
                  <Button
                    variant="contained" size="large"
                    onClick={() => addToCart(course)}
                    disabled={isInCart(courseId)}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
                  >
                    {isInCart(courseId) ? 'Added to Cart ✓' : 'Add to Cart'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right: Lessons List */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: '16px', border: '1px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            position: { md: 'sticky' }, top: { md: 80 }
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  Course Content
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {course.lessons.length} lessons • {course.duration}
                </Typography>
              </Box>
              <List sx={{ p: 1 }}>
                {course.lessons.map((lesson, index) => (
                  <ListItem key={lesson.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      disabled={!enrolled}
                      selected={currentLesson?.id === lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      sx={{
                        borderRadius: '10px', py: 1.5,
                        '&.Mui-selected': { bgcolor: '#EFF6FF' },
                        '&.Mui-disabled': { opacity: 0.5 }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {enrolled
                          ? <PlayCircleRoundedIcon sx={{ color: currentLesson?.id === lesson.id ? '#2563EB' : '#94a3b8', fontSize: '1.2rem' }} />
                          : <LockRoundedIcon sx={{ color: '#cbd5e1', fontSize: '1rem' }} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={`${index + 1}. ${lesson.title}`}
                        secondary={lesson.duration}
                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {lesson.hasNotes && <DescriptionRoundedIcon sx={{ fontSize: '0.9rem', color: '#94a3b8' }} />}
                        {lesson.hasPdf && <PictureAsPdfRoundedIcon sx={{ fontSize: '0.9rem', color: '#94a3b8' }} />}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}