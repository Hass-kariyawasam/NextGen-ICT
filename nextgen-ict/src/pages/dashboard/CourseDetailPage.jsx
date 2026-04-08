import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItemButton,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  Divider
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { mockCourses } from '../../data/mockCourses';
import { normalizeCourse } from '../../utils/courseHelpers';
import { useCart } from '../../context/CartContext';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, isEnrolled, isPending } = useCart();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        if (snapshot.empty) setCourses(mockCourses.map(normalizeCourse));
        else setCourses(snapshot.docs.map((doc) => normalizeCourse({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      () => {
        setCourses(mockCourses.map(normalizeCourse));
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const course = useMemo(() => courses.find((item) => item.id === courseId), [courses, courseId]);
  const enrolled = isEnrolled(courseId);
  const pending = isPending(courseId);
  const inCart = isInCart(courseId);
  const firstLesson = course?.lessons?.[0];

  const toggleLessonExpand = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#ff8c00' }} /></Box>;
  }

  if (!course) {
    return (
      <Box className="lms-panel" sx={{ borderRadius: 5, py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>Course not found</Typography>
        <Button onClick={() => navigate('/dashboard-lms/courses')}>Go to courses</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackRoundedIcon />} 
        onClick={() => navigate('/dashboard-lms/courses')} 
        sx={{ mb: 3, textTransform: 'none', fontWeight: 700, color: '#0f172a' }}
      >
        Back to Courses
      </Button>

      <Grid container spacing={3}>
        {/* Left Column - Main Content with Video */}
        <Grid item xs={12} lg={8}>
          {/* Video Preview */}
          <Card 
            className="lms-panel" 
            sx={{ 
              borderRadius: 1, 
              overflow: 'hidden', 
              mb: 3,
              border: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ position: 'relative', bgcolor: '#f1f5f9' }}>
              {firstLesson?.youtubeId ? (
                <Box sx={{ paddingBottom: '56.25%', position: 'relative', height: 0 }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    src={`https://www.youtube.com/embed/${firstLesson.youtubeId}?rel=0&modestbranding=1`}
                    title={firstLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    height: 400, 
                    backgroundImage: `url(${course.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PlayCircleRoundedIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.7)' }} />
                </Box>
              )}
            </Box>
            <CardContent sx={{ p: 2, bgcolor: 'rgba(15,23,42,0.02)' }}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip 
                  label="FREE PREVIEW" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#ff8c00',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }} 
                />
                <Chip 
                  label={`First Lesson: ${firstLesson?.duration || 'Flexible'}`} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
              <Typography sx={{ fontSize: '0.9rem', color: '#0f172a', mt: 1.5, fontWeight: 600 }}>
                Watch this free preview lesson to get started. Enroll to unlock all lessons.
              </Typography>
            </CardContent>
          </Card>

          {/* Course Info Section - Below Video */}
          <Card 
            className="lms-panel" 
            sx={{ 
              borderRadius: 1, 
              mb: 3,
              border: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip label={course.category} sx={{ fontWeight: 700, bgcolor: '#0052cc', color: '#fff' }} />
                <Rating value={course.rating || 4.5} readOnly size="small" sx={{ my: 0.5 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, my: 0.5 }}>
                  ({course.students || 0} students)
                </Typography>
              </Stack>

              <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', mb: 1.5 }}>
                {course.title}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.8, mb: 2.5, fontWeight: 500 }}>
                {course.description}
              </Typography>

              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', mb: 0.8 }}>
                Instructor
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0052cc', mb: 2.5 }}>
                {course.teacher}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              {/* Course Stats */}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <MenuBookRoundedIcon sx={{ fontSize: 28, color: '#0052cc', mb: 0.8 }} />
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {course.totalLessons || 0}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>Lessons</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 28, color: '#ff8c00', mb: 0.8 }} />
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {course.duration}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>Duration</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SchoolRoundedIcon sx={{ fontSize: 28, color: '#10b981', mb: 0.8 }} />
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {course.students || 0}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>Enrolled</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VerifiedRoundedIcon sx={{ fontSize: 28, color: '#8b5cf6', mb: 0.8 }} />
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      Yes
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>Certificate</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Lessons Curriculum & Purchase Card */}
        <Grid item xs={12} lg={4}>
          {/* Purchase Card - Sticky at Top */}
          <Card 
            className="lms-panel" 
            sx={{ 
              borderRadius: 1, 
              position: 'sticky',
              top: 100,
              mb: 3,
              border: '1px solid rgba(15,23,42,0.06)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            {/* Course Thumbnail */}
            <Box
              sx={{
                height: 200,
                backgroundImage: `url(${course.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <Chip 
                label={course.category} 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  left: 10,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontWeight: 700
                }}
              />
            </Box>

            <CardContent sx={{ p: 2 }}>
              {/* Price */}
              <Typography sx={{ fontSize: '0.85rem', color: '#0f172a', mb: 0.5, fontWeight: 600 }}>
                Price
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#0052cc', mb: 0.2 }}>
                Rs. {course.price?.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#ff8c00', mb: 2, fontWeight: 600 }}>
                Limited time offer
              </Typography>

              {/* Action Button */}
              <Box sx={{ mb: 2 }}>
                {enrolled ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/dashboard-lms/course/${courseId}`)}
                    sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, bgcolor: '#0052cc', '&:hover': { bgcolor: '#0041a3' } }}
                  >
                    Go to Course
                  </Button>
                ) : pending ? (
                  <Button
                    fullWidth
                    disabled
                    variant="outlined"
                    sx={{ textTransform: 'none', py: 1.5, fontWeight: 700 }}
                  >
                    Pending Approval
                  </Button>
                ) : inCart ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/dashboard-lms/cart')}
                    sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                  >
                    View Cart
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => addToCart(course)}
                    sx={{ textTransform: 'none', py: 1.5, fontWeight: 700, bgcolor: '#ff8c00', '&:hover': { bgcolor: '#e67e00' } }}
                  >
                    Add to Cart
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Course Features */}
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
                Course Includes
              </Typography>

              <Stack spacing={0.8}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    {course.totalLessons || 0} Video Lessons
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    Complete {course.duration} of Content
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    Downloadable Materials & Notes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    Lifetime Access
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>
                    Certificate of Completion
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Curriculum/Lessons Section - Gallery Style */}
          <Card 
            className="lms-panel" 
            sx={{ 
              borderRadius: 1,
              border: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', mb: 2 }}>
                Curriculum ({course.lessons?.length || 0} lessons)
              </Typography>

              <Stack spacing={1}>
                {course.lessons?.map((lesson, index) => (
                  <Box
                    key={lesson.id}
                    onClick={() => toggleLessonExpand(lesson.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: expandedLessons[lesson.id] ? 'rgba(0,82,204,0.08)' : 'rgba(0,82,204,0.03)',
                      border: '1px solid',
                      borderColor: expandedLessons[lesson.id] ? '#0052cc' : 'rgba(0,82,204,0.2)',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0,82,204,0.06)' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '2px',
                        bgcolor: index === 0 ? '#ff8c00' : '#0052cc',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
                          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', flex: 1 }}>
                            {lesson.title}
                          </Typography>
                          {index === 0 && (
                            <Chip 
                              label="FREE" 
                              size="small" 
                              sx={{ height: 18, fontWeight: 700, fontSize: '0.65rem', bgcolor: '#ff8c00', color: '#fff' }}
                            />
                          )}
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                          {lesson.duration}
                        </Typography>
                        {(lesson.hasNotes || lesson.hasPdf) && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {lesson.hasNotes && <DescriptionRoundedIcon sx={{ fontSize: 14, color: '#0052cc' }} />}
                            {lesson.hasPdf && <PictureAsPdfRoundedIcon sx={{ fontSize: 14, color: '#ef4444' }} />}
                          </Box>
                        )}
                      </Box>
                      {expandedLessons[lesson.id] ? 
                        <ExpandLessRoundedIcon sx={{ fontSize: 18, color: '#0052cc', flexShrink: 0, mt: 0.2 }} /> : 
                        <ExpandMoreRoundedIcon sx={{ fontSize: 18, color: '#cbd5e1', flexShrink: 0, mt: 0.2 }} />
                      }
                    </Box>

                    {/* Expanded Content */}
                    <Collapse in={expandedLessons[lesson.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 1, pt: 1, pl: 3.5, borderTop: '1px solid rgba(0,82,204,0.1)' }}>
                        {lesson.description && (
                          <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', lineHeight: 1.6, mb: 1, fontWeight: 500 }}>
                            {lesson.description}
                          </Typography>
                        )}
                        {(lesson.notesLink || lesson.pdfLink) && (
                          <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                            {lesson.notesLink && (
                              <Button 
                                component="a" 
                                href={lesson.notesLink} 
                                target="_blank" 
                                rel="noreferrer"
                                size="small"
                                variant="outlined" 
                                startIcon={<DescriptionRoundedIcon />} 
                                sx={{ textTransform: 'none', borderRadius: 0.5, fontSize: '0.75rem' }}
                              >
                                Notes
                              </Button>
                            )}
                            {lesson.pdfLink && (
                              <Button 
                                component="a" 
                                href={lesson.pdfLink} 
                                target="_blank" 
                                rel="noreferrer"
                                size="small"
                                variant="outlined" 
                                startIcon={<PictureAsPdfRoundedIcon />} 
                                sx={{ textTransform: 'none', borderRadius: 0.5, fontSize: '0.75rem' }}
                              >
                                PDF
                              </Button>
                            )}
                          </Stack>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
