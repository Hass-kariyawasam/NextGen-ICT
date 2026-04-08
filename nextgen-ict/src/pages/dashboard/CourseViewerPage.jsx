import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItemButton,
  Stack,
  Typography
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { mockCourses } from '../../data/mockCourses';
import { normalizeCourse } from '../../utils/courseHelpers';
import { useCart } from '../../context/CartContext';

export default function CourseViewerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, isEnrolled, isPending } = useCart();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState('');

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

  useEffect(() => {
    if (course?.lessons?.length && !activeLessonId) {
      setActiveLessonId(course.lessons[0].id);
    }
  }, [course, activeLessonId]);

  const activeLesson = useMemo(
    () => course?.lessons?.find((item) => item.id === activeLessonId) || course?.lessons?.[0],
    [course, activeLessonId]
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }

  if (!course) {
    return (
      <Box className="lms-panel" sx={{ borderRadius: 5, py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>Course not found</Typography>
        <Button onClick={() => navigate('/dashboard-lms/courses')}>Go to courses</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}>
        Back
      </Button>

      <Grid container spacing={2.5}>
        <Grid item xs={12} xl={8}>
          <Card className="lms-panel" sx={{ borderRadius: 6, overflow: 'hidden', mb: 2.5 }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              {enrolled && activeLesson?.youtubeId ? (
                <Box className="lms-video-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeLesson.youtubeId}?rel=0&modestbranding=1`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              ) : (
                <Box className="lms-video-frame" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(15,23,42,0.35), rgba(15,23,42,0.78)), url(${course.thumbnail}) center/cover` }}>
                  <Box sx={{ textAlign: 'center', px: 3 }}>
                    <LockRoundedIcon sx={{ color: '#ffffff', fontSize: '3rem', mb: 1 }} />
                    <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', mb: 1 }}>Enroll to watch the lessons</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2.5 }}>Open the course after approval to play each lesson video separately.</Typography>
                    {pending ? (
                      <Button disabled variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Pending approval</Button>
                    ) : inCart ? (
                      <Button variant="contained" onClick={() => navigate('/dashboard-lms/cart')} sx={{ borderRadius: 3, textTransform: 'none' }}>Go to cart</Button>
                    ) : (
                      <Button variant="contained" onClick={() => addToCart(course)} sx={{ borderRadius: 3, textTransform: 'none' }}>
                        Add to cart
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Card>

          <Card className="lms-panel" sx={{ borderRadius: 6 }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
                <Chip label={course.category} sx={{ fontWeight: 700 }} />
                <Chip label={`${course.totalLessons} lessons`} variant="outlined" />
                {course.duration && <Chip label={course.duration} variant="outlined" />}
              </Stack>

              <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', mb: 1 }}>{course.title}</Typography>
              <Typography sx={{ color: '#64748b', lineHeight: 1.8, mb: 2 }}>{course.description}</Typography>

              <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.06)' }}>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mb: 0.5 }}>Current Lesson</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{activeLesson?.title || 'No lesson selected'}</Typography>
                {activeLesson?.duration && <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mt: 0.5 }}>{activeLesson.duration}</Typography>}
                {activeLesson?.description && (
                  <Typography sx={{ fontSize: '0.9rem', color: '#475569', mt: 1.25, lineHeight: 1.75 }}>{activeLesson.description}</Typography>
                )}

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                  {activeLesson?.notesLink && (
                    <Button component="a" href={activeLesson.notesLink} target="_blank" rel="noreferrer" variant="outlined" startIcon={<DescriptionRoundedIcon />} sx={{ textTransform: 'none', borderRadius: 3 }}>
                      Lesson notes
                    </Button>
                  )}
                  {activeLesson?.pdfLink && (
                    <Button component="a" href={activeLesson.pdfLink} target="_blank" rel="noreferrer" variant="outlined" startIcon={<PictureAsPdfRoundedIcon />} sx={{ textTransform: 'none', borderRadius: 3 }}>
                      Lesson PDF
                    </Button>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} xl={4}>
          <Card className="lms-panel" sx={{ borderRadius: 6, position: { xl: 'sticky' }, top: 110 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.25, py: 2, borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Lessons</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Each lesson has its own video, title, description, and attachments.</Typography>
              </Box>

              <List className="lms-scroll-list" sx={{ px: 1.25, py: 1.25 }}>
                {course.lessons.map((lesson, index) => {
                  const selected = activeLesson?.id === lesson.id;
                  return (
                    <ListItemButton
                      key={lesson.id}
                      onClick={() => enrolled && setActiveLessonId(lesson.id)}
                      disabled={!enrolled}
                      sx={{
                        mb: 1,
                        alignItems: 'flex-start',
                        borderRadius: 4,
                        border: '1px solid rgba(15,23,42,0.06)',
                        bgcolor: selected ? 'rgba(28,63,170,0.08)' : '#fff',
                        p: 1.5,
                        '&.Mui-disabled': { opacity: 0.55 }
                      }}
                    >
                      <Box sx={{ width: 34, height: 34, borderRadius: 2.5, bgcolor: selected ? '#1c3faa' : 'rgba(15,23,42,0.06)', color: selected ? '#fff' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                        {enrolled ? <PlayCircleRoundedIcon sx={{ fontSize: '1rem' }} /> : <LockRoundedIcon sx={{ fontSize: '1rem' }} />}
                      </Box>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                          {index + 1}. {lesson.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6 }}>
                          {lesson.description || 'Lesson details will appear here.'}
                        </Typography>
                        <Stack direction="row" spacing={1.25} sx={{ mt: 1 }}>
                          {lesson.duration && <Typography sx={{ fontSize: '0.74rem', color: '#475569' }}>{lesson.duration}</Typography>}
                          {lesson.notesLink && <DescriptionRoundedIcon sx={{ fontSize: '0.92rem', color: '#64748b' }} />}
                          {lesson.pdfLink && <PictureAsPdfRoundedIcon sx={{ fontSize: '0.92rem', color: '#64748b' }} />}
                        </Stack>
                      </Box>
                    </ListItemButton>
                  );
                })}
              </List>
            </CardContent>
          </Card>

          {!enrolled && (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 4 }} icon={<MenuBookRoundedIcon fontSize="inherit" />}>
              The lesson list is visible, but video playback and lesson materials unlock only after admin approval.
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
