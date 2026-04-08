import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper,
  Tabs, Tab, Button, Chip, Avatar, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Alert, CircularProgress, Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  People as StudentsIcon,
  ShoppingCart as EnrollmentsIcon,
  Schedule as ScheduleIcon,
  Notifications as NoticesIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  VideoLibrary as VideoIcon,
  CloudUpload as UploadIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// ===== ADMIN DASHBOARD MAIN COMPONENT =====
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Students
      const studentsSnap = await getDocs(collection(db, 'users'));
      const students = studentsSnap.docs.filter(d => d.data().role === 'student');
      
      // Courses
      const coursesSnap = await getDocs(collection(db, 'courses'));
      
      // Enrollments
      const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
      const enrollments = enrollmentsSnap.docs.map(d => d.data());
      const pending = enrollments.filter(e => e.status === 'pending').length;
      const approved = enrollments.filter(e => e.status === 'approved').length;
      const revenue = enrollments
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + (e.price || 0), 0);

      setStats({
        totalStudents: students.length,
        totalCourses: coursesSnap.size,
        pendingEnrollments: pending,
        approvedEnrollments: approved,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography sx={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          Manage courses, students, and enrollments
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#001f5c', color: '#0052cc', width: 56, height: 56 }}>
                  <StudentsIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Total Students
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {stats.totalStudents}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#001f5c', color: '#0052cc', width: 56, height: 56 }}>
                  <CoursesIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Total Courses
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {stats.totalCourses}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#5a3a00', color: '#ff8c00', width: 56, height: 56 }}>
                  <EnrollmentsIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Pending Approvals
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {stats.pendingEnrollments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#001f5c', color: '#0052cc', width: 56, height: 56 }}>
                  <DashboardIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: '16px', border: '1px solid #334155', mb: 3, bgcolor: '#1e293b' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ 
            borderBottom: '1px solid #334155', 
            px: 2,
            '& .MuiTabs-indicator': { bgcolor: '#0052cc' }
          }}
          textColor="inherit"
        >
          <Tab label="Courses Management" icon={<CoursesIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#0052cc' } }} />
          <Tab label="Lesson Videos" icon={<VideoIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#0052cc' } }} />
          <Tab label="Enrollments" icon={<EnrollmentsIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#ff8c00' } }} />
          <Tab label="Students" icon={<StudentsIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#0052cc' } }} />
          <Tab label="Schedule & Notices" icon={<ScheduleIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#ff8c00' } }} />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" sx={{ color: '#cbd5e1', '&.Mui-selected': { color: '#0052cc' } }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && <CoursesManagement onUpdate={fetchStats} />}
          {activeTab === 1 && <LessonVideosManagement />}
          {activeTab === 2 && <EnrollmentsManagement onUpdate={fetchStats} />}
          {activeTab === 3 && <StudentsManagement />}
          {activeTab === 4 && <ScheduleNoticesManagement />}
          {activeTab === 5 && <ExamSettings />}
        </Box>
      </Paper>
    </Box>
  );
}

// ===== COURSES MANAGEMENT COMPONENT =====

function CoursesManagement({ onUpdate }) {
  const emptyLesson = () => ({
    id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    notesLink: '',
    pdfLink: ''
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'Theory',
    teacher: '',
    totalLessons: 0,
    duration: '',
    thumbnail: '',
    pdfDriveLink: '',
    notesDriveLink: '',
    extraDriveLink: '',
    lessons: [emptyLesson()]
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'courses'));
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  const handleLessonChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson, lessonIndex) =>
        lessonIndex === index ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  const addLesson = () => {
    setFormData((prev) => ({ ...prev, lessons: [...prev.lessons, emptyLesson()] }));
  };

  const removeLesson = (index) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, lessonIndex) => lessonIndex !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const cleanedLessons = (formData.lessons || [])
        .map((lesson, index) => ({
          id: lesson.id || `lesson-${index + 1}`,
          title: lesson.title?.trim() || `Lesson ${index + 1}`,
          description: lesson.description?.trim() || '',
          duration: lesson.duration?.trim() || '',
          videoUrl: lesson.videoUrl?.trim() || '',
          notesLink: lesson.notesLink?.trim() || '',
          pdfLink: lesson.pdfLink?.trim() || ''
        }))
        .filter((lesson) => lesson.title || lesson.videoUrl || lesson.description);

      const payload = {
        ...formData,
        totalLessons: cleanedLessons.length,
        lessons: cleanedLessons,
        updatedAt: serverTimestamp()
      };

      if (editCourse) {
        await updateDoc(doc(db, 'courses', editCourse.id), payload);
      } else {
        await addDoc(collection(db, 'courses'), {
          ...payload,
          rating: 0,
          students: 0,
          createdAt: serverTimestamp()
        });
      }
      setDialogOpen(false);
      setEditCourse(null);
      resetForm();
      fetchCourses();
      onUpdate?.();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        fetchCourses();
        onUpdate?.();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setFormData({
      title: course.title || '',
      shortTitle: course.shortTitle || '',
      description: course.description || '',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      category: course.category || 'Theory',
      teacher: course.teacher || '',
      totalLessons: course.totalLessons || 0,
      duration: course.duration || '',
      thumbnail: course.thumbnail || '',
      pdfDriveLink: course.pdfDriveLink || '',
      notesDriveLink: course.notesDriveLink || '',
      extraDriveLink: course.extraDriveLink || '',
      lessons: Array.isArray(course.lessons) && course.lessons.length
        ? course.lessons.map((lesson, index) => ({
            id: lesson.id || `lesson-${index + 1}`,
            title: lesson.title || '',
            description: lesson.description || '',
            duration: lesson.duration || '',
            videoUrl: lesson.videoUrl || lesson.youtubeLink || lesson.youtubeUrl || lesson.youtubeId || '',
            notesLink: lesson.notesLink || '',
            pdfLink: lesson.pdfLink || ''
          }))
        : [emptyLesson()]
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      shortTitle: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: 'Theory',
      teacher: '',
      totalLessons: 0,
      duration: '',
      thumbnail: '',
      pdfDriveLink: '',
      notesDriveLink: '',
      extraDriveLink: '',
      lessons: [emptyLesson()]
    });
  };

  if (loading) return <CircularProgress sx={{ color: '#ff8c00' }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Manage Courses ({courses.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditCourse(null);
            resetForm();
            setDialogOpen(true);
          }}
          sx={{ borderRadius: '10px', textTransform: 'none', bgcolor: '#ff8c00', '&:hover': { bgcolor: '#e67e00' } }}
        >
          Add New Course
        </Button>
      </Box>

      <TableContainer sx={{ bgcolor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Teacher</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Lessons</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.id} sx={{ borderBottom: '1px solid #334155', '&:hover': { bgcolor: '#263449' } }}>
                <TableCell sx={{ color: '#cbd5e1' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={course.thumbnail} variant="rounded" />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9' }}>
                        {course.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {course.duration || 'Flexible duration'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}><Chip label={course.category} size="small" sx={{ bgcolor: '#001f5c', color: '#0052cc', fontWeight: 600 }} /></TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>{course.teacher}</TableCell>
                <TableCell sx={{ color: '#f1f5f9' }}>
                  <Typography sx={{ fontWeight: 700 }}>Rs. {Number(course.price || 0).toLocaleString()}</Typography>
                </TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>{course.lessons?.length || course.totalLessons || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(course)} sx={{ color: '#0052cc' }} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)} sx={{ color: '#ef4444' }} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
          {editCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Course Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Short Title" value={formData.shortTitle} onChange={e => setFormData({ ...formData, shortTitle: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } }}>Category</InputLabel>
                <Select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} label="Category"
                  sx={{ color: '#f1f5f9', bgcolor: '#263449', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff8c00' } }}
                >
                  <MenuItem value="Theory" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Theory</MenuItem>
                  <MenuItem value="Programming" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Programming</MenuItem>
                  <MenuItem value="Web" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Web Development</MenuItem>
                  <MenuItem value="Database" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Database</MenuItem>
                  <MenuItem value="Networking" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Networking</MenuItem>
                  <MenuItem value="Free" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Free</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Teacher Name" value={formData.teacher} onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Duration" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Original Price" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Thumbnail URL" value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Course PDF Link" value={formData.pdfDriveLink} onChange={e => setFormData({ ...formData, pdfDriveLink: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Course Notes Link" value={formData.notesDriveLink} onChange={e => setFormData({ ...formData, notesDriveLink: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Extra Drive Link" value={formData.extraDriveLink} onChange={e => setFormData({ ...formData, extraDriveLink: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1, borderColor: '#334155' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#f1f5f9' }}>Lesson Manager</Typography>
                <Button variant="outlined" onClick={addLesson} sx={{ textTransform: 'none', borderColor: '#334155', color: '#ff8c00', '&:hover': { borderColor: '#ff8c00', bgcolor: 'transparent' } }}>Add Lesson</Button>
              </Box>
            </Grid>

            {formData.lessons.map((lesson, index) => (
              <Grid item xs={12} key={lesson.id}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', bgcolor: '#0f172a', borderColor: '#334155' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#f1f5f9' }}>Lesson {index + 1}</Typography>
                    {formData.lessons.length > 1 && (
                      <Button color="error" onClick={() => removeLesson(index)} sx={{ textTransform: 'none', color: '#ef4444' }}>
                        Remove
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Lesson Title" value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Duration" value={lesson.duration} onChange={e => handleLessonChange(index, 'duration', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline rows={2} label="Lesson Description" value={lesson.description} onChange={e => handleLessonChange(index, 'description', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Lesson Video Link or YouTube ID" value={lesson.videoUrl} onChange={e => handleLessonChange(index, 'videoUrl', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Lesson Notes Link" value={lesson.notesLink} onChange={e => handleLessonChange(index, 'notesLink', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Lesson PDF Link" value={lesson.pdfLink} onChange={e => handleLessonChange(index, 'pdfLink', e.target.value)}
                        InputProps={{ sx: { color: '#f1f5f9' } }}
                        InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid #334155', p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1', '&:hover': { bgcolor: '#263449' } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}>{editCourse ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


// ===== LESSON VIDEOS MANAGEMENT COMPONENT =====
function LessonVideosManagement() {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoDialog, setVideoDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [videoForm, setVideoForm] = useState({
    videoUrl: '',
    videoTitle: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'courses'));
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  const handleEditLesson = (course, lesson) => {
    setSelectedCourseId(course.id);
    setSelectedLesson(lesson);
    setVideoForm({
      videoUrl: lesson.videoUrl || '',
      videoTitle: lesson.title || ''
    });
    setVideoDialog(true);
  };

  const handleSaveVideo = async () => {
    if (!selectedCourseId || !selectedLesson) return;

    try {
      const course = courses.find(c => c.id === selectedCourseId);
      const updatedLessons = (course.lessons || []).map(l =>
        l.id === selectedLesson.id
          ? { ...l, videoUrl: videoForm.videoUrl, title: videoForm.videoTitle }
          : l
      );

      await updateDoc(doc(db, 'courses', selectedCourseId), {
        lessons: updatedLessons,
        updatedAt: serverTimestamp()
      });

      setVideoDialog(false);
      setSelectedLesson(null);
      setSelectedCourseId(null);
      setVideoForm({ videoUrl: '', videoTitle: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  if (loading) return <CircularProgress sx={{ color: '#0052cc' }} />;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 3 }}>
        Manage Lesson Videos ({courses.length} Courses)
      </Typography>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
        {courses.map(course => (
          <Box key={course.id}>
            <Box
              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              sx={{
                p: 2,
                bgcolor: '#0f172a',
                borderBottom: '1px solid #334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': { bgcolor: '#1a1f3a' },
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '2px solid #334155'
                    }}
                  />
                )}
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                    {course.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {course.lessons?.length || 0} Lessons
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={course.category}
                  size="small"
                  sx={{
                    bgcolor: '#001f5c',
                    color: '#0052cc',
                    fontWeight: 600
                  }}
                />
                <PlayIcon sx={{ color: '#ff8c00', fontSize: 28 }} />
              </Box>
            </Box>

            {expandedCourse === course.id && (
              <Box sx={{ p: 2 }}>
                {course.lessons && course.lessons.length > 0 ? (
                  <Grid container spacing={2}>
                    {course.lessons.map((lesson, idx) => (
                      <Grid item xs={12} key={lesson.id}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: '#263449',
                            border: '1px solid #334155',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': { borderColor: '#0052cc', boxShadow: '0 0 10px rgba(0, 82, 204, 0.2)' },
                            transition: 'all 0.3s'
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#f1f5f9', mb: 0.5 }}>
                              Lesson {idx + 1}: {lesson.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              {lesson.videoUrl ? (
                                <>
                                  <Chip
                                    icon={<PlayIcon />}
                                    label="Video Available"
                                    size="small"
                                    sx={{
                                      bgcolor: '#001f5c',
                                      color: '#0052cc',
                                      fontWeight: 600
                                    }}
                                  />
                                  <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {lesson.videoUrl.includes('youtube') ? '🎬 YouTube' : '📹 Video Link'}
                                  </Typography>
                                </>
                              ) : (
                                <Chip
                                  label="No Video"
                                  size="small"
                                  sx={{
                                    bgcolor: '#3a2a2a',
                                    color: '#cbd5e1'
                                  }}
                                />
                              )}
                              {lesson.duration && (
                                <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                                  ⏱️ {lesson.duration}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => handleEditLesson(course, lesson)}
                            sx={{
                              bgcolor: '#0052cc',
                              color: '#f1f5f9',
                              '&:hover': { bgcolor: '#0041a3' },
                              textTransform: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Update Video
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="warning" sx={{
                    bgcolor: '#5a3a00',
                    color: '#ff8c00',
                    '& .MuiAlert-icon': { color: '#ff8c00' }
                  }}>
                    No lessons added yet for this course
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Paper>

      {/* Video Upload Dialog */}
      <Dialog open={videoDialog} onClose={() => setVideoDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
          Update Lesson Video
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.9rem', color: '#cbd5e1', mb: 1 }}>
                Lesson: <strong>{selectedLesson?.title}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lesson Title"
                value={videoForm.videoTitle}
                onChange={e => setVideoForm({ ...videoForm, videoTitle: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#0052cc' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#0052cc' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Video URL or YouTube Link"
                placeholder="e.g., https://www.youtube.com/watch?v=... or your video link"
                value={videoForm.videoUrl}
                onChange={e => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#0052cc' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#0052cc' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{
                bgcolor: '#001f5c',
                color: '#0052cc',
                '& .MuiAlert-icon': { color: '#0052cc' },
                fontSize: '0.85rem'
              }}>
                💡 Tip: Paste YouTube URL or any video hosting link (Google Drive, Vimeo, etc.)
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid #334155', p: 2 }}>
          <Button onClick={() => setVideoDialog(false)} sx={{ color: '#cbd5e1', '&:hover': { bgcolor: '#263449' } }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveVideo}
            sx={{
              bgcolor: '#0052cc',
              color: '#f1f5f9',
              '&:hover': { bgcolor: '#0041a3' }
            }}
          >
            Save Video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


// ===== ENROLLMENTS MANAGEMENT =====
function EnrollmentsManagement({ onUpdate }) {
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'enrollments');
      if (filter !== 'all') {
        q = query(q, where('status', '==', filter));
      }
      const snap = await getDocs(q);
      setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'enrollments', id), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      fetchEnrollments();
      onUpdate?.();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'enrollments', id), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
      fetchEnrollments();
      onUpdate?.();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Remove this enrollment permanently?')) {
      try {
        await deleteDoc(doc(db, 'enrollments', id));
        fetchEnrollments();
        onUpdate?.();
      } catch (error) {
        console.error('Error removing:', error);
      }
    }
  };

  if (loading) return <CircularProgress sx={{ color: '#ff8c00' }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Enrollments ({enrollments.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={filter} onChange={e => setFilter(e.target.value)}
            sx={{ color: '#f1f5f9', bgcolor: '#1e293b', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff8c00' }, '& .MuiSvgIcon-root': { color: '#f1f5f9' } }}
          >
            <MenuItem value="all" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>All</MenuItem>
            <MenuItem value="pending" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Pending</MenuItem>
            <MenuItem value="approved" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Approved</MenuItem>
            <MenuItem value="rejected" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer sx={{ bgcolor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Payment Slip</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map(enrollment => (
              <TableRow key={enrollment.id} sx={{ borderBottom: '1px solid #334155', '&:hover': { bgcolor: '#263449' } }}>
                <TableCell sx={{ color: '#cbd5e1' }}>{enrollment.courseTitle}</TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>
                  <Typography sx={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#f1f5f9' }}>
                    {enrollment.userId?.slice(0, 12)}...
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#f1f5f9', fontWeight: 700 }}>Rs. {enrollment.price?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={enrollment.status}
                    color={
                      enrollment.status === 'approved' ? 'success' :
                      enrollment.status === 'pending' ? 'warning' : 'error'
                    }
                    size="small"
                    sx={{
                      bgcolor: enrollment.status === 'approved' ? '#064e3b' : enrollment.status === 'pending' ? '#78350f' : '#7f1d1d',
                      color: enrollment.status === 'approved' ? '#86efac' : enrollment.status === 'pending' ? '#fcd34d' : '#fca5a5',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  {enrollment.slipLink ? (
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      href={enrollment.slipLink}
                      target="_blank"
                      sx={{ color: '#0052cc', textTransform: 'none' }}
                    >
                      View
                    </Button>
                  ) : (
                    <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      No slip
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {enrollment.status === 'pending' && (
                    <>
                      <IconButton onClick={() => handleApprove(enrollment.id)} sx={{ color: '#0052cc' }} size="small">
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleReject(enrollment.id)} sx={{ color: '#ef4444' }} size="small">
                        <RejectIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                  <IconButton onClick={() => handleRemove(enrollment.id)} sx={{ color: '#ef4444' }} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ===== STUDENTS MANAGEMENT =====
function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const studentsList = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.role === 'student');
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditDialog(true);
  };

  const handleSaveStudent = async () => {
    try {
      await updateDoc(doc(db, 'users', selectedStudent.id), {
        name: selectedStudent.name,
        email: selectedStudent.email,
        studentId: selectedStudent.studentId,
        phone: selectedStudent.phone,
        center: selectedStudent.center
      });
      setEditDialog(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <CircularProgress sx={{ color: '#ff8c00' }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Students ({students.length})
        </Typography>
        <TextField
          size="small"
          placeholder="Search students..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: 300, '& .MuiOutlinedInput-root': { color: '#f1f5f9', borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } }, '& .MuiOutlinedInput-input::placeholder': { color: '#94a3b8', opacity: 0.7 } }}
          InputProps={{
            sx: { color: '#f1f5f9' }
          }}
        />
      </Box>

      <TableContainer sx={{ bgcolor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Center</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f1f5f9' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.id} sx={{ borderBottom: '1px solid #334155', '&:hover': { bgcolor: '#263449' } }}>
                <TableCell sx={{ color: '#f1f5f9' }}>{student.name}</TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>{student.email}</TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>{student.studentId || 'N/A'}</TableCell>
                <TableCell sx={{ color: '#cbd5e1' }}>{student.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={student.center || 'online'}
                    size="small"
                    sx={{
                      bgcolor: student.center === 'physical' ? '#001f5c' : '#001f5c',
                      color: student.center === 'physical' ? '#0052cc' : '#0052cc'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student)} sx={{ color: '#0052cc' }} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Student Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>Edit Student</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>
          {selectedStudent && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedStudent.name || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                  InputProps={{ sx: { color: '#f1f5f9' } }}
                  InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedStudent.email || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                  InputProps={{ sx: { color: '#f1f5f9' } }}
                  InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={selectedStudent.studentId || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, studentId: e.target.value })}
                  InputProps={{ sx: { color: '#f1f5f9' } }}
                  InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="WhatsApp Number"
                  value={selectedStudent.phone || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                  InputProps={{ sx: { color: '#f1f5f9' } }}
                  InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } }}>Class Type</InputLabel>
                  <Select
                    value={selectedStudent.center || 'online'}
                    onChange={e => setSelectedStudent({ ...selectedStudent, center: e.target.value })}
                    label="Class Type"
                    sx={{ color: '#f1f5f9', bgcolor: '#263449', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff8c00' } }}
                  >
                    <MenuItem value="physical" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Physical (Galle)</MenuItem>
                    <MenuItem value="online" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid #334155', p: 2 }}>
          <Button onClick={() => setEditDialog(false)} sx={{ color: '#cbd5e1', '&:hover': { bgcolor: '#263449' } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStudent} sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ===== SCHEDULE & NOTICES MANAGEMENT =====
function ScheduleNoticesManagement() {
  const [schedules, setSchedules] = useState([]);
  const [notices, setNotices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    title: '',
    time: '',
    type: 'live',
    course: ''
  });
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    fetchSchedules();
    fetchNotices();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snap = await getDocs(collection(db, 'schedules'));
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const snap = await getDocs(collection(db, 'notices'));
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await addDoc(collection(db, 'schedules'), {
        ...scheduleForm,
        createdAt: serverTimestamp()
      });
      setDialogOpen(false);
      setScheduleForm({ date: '', title: '', time: '', type: 'live', course: '' });
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleSaveNotice = async () => {
    try {
      await addDoc(collection(db, 'notices'), {
        ...noticeForm,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
      setNoticeDialogOpen(false);
      setNoticeForm({ title: '', message: '', type: 'info' });
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Schedules */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
              Upcoming Schedule
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}
            >
              Add
            </Button>
          </Box>
          <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            {schedules.map(schedule => (
              <Box key={schedule.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #334155' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#f1f5f9' }}>{schedule.title}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {schedule.date} • {schedule.time}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDeleteSchedule(schedule.id)} size="small" sx={{ color: '#ef4444' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Notices */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
              Notices
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNoticeDialogOpen(true)}
              sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}
            >
              Add
            </Button>
          </Box>
          <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #334155', bgcolor: '#1e293b' }}>
            {notices.map(notice => (
              <Alert
                key={notice.id}
                severity={notice.type}
                sx={{ 
                  mb: 2,
                  bgcolor: notice.type === 'info' ? '#1e3a5f' : notice.type === 'success' ? '#1e3a2f' : notice.type === 'warning' ? '#3a2f1e' : '#3a1f1f',
                  color: notice.type === 'info' ? '#60a5fa' : notice.type === 'success' ? '#4ade80' : notice.type === 'warning' ? '#fbbf24' : '#ef4444'
                }}
                action={
                  <IconButton onClick={() => handleDeleteNotice(notice.id)} size="small" sx={{ color: 'inherit' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {notice.title}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem' }}>
                  {notice.message}
                </Typography>
              </Alert>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>Add Schedule</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={scheduleForm.title}
                onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={scheduleForm.date}
                onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                inputProps={{ sx: { color: '#f1f5f9' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Time"
                InputLabelProps={{ shrink: true }}
                value={scheduleForm.time}
                onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                inputProps={{ sx: { color: '#f1f5f9' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } }}>Type</InputLabel>
                <Select
                  value={scheduleForm.type}
                  onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                  label="Type"
                  sx={{ color: '#f1f5f9', bgcolor: '#263449', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff8c00' } }}
                >
                  <MenuItem value="live" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Live Class</MenuItem>
                  <MenuItem value="practical" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Practical</MenuItem>
                  <MenuItem value="exam" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Exam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                value={scheduleForm.course}
                onChange={e => setScheduleForm({ ...scheduleForm, course: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid #334155', p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#cbd5e1', '&:hover': { bgcolor: '#263449' } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSchedule} sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Notice Dialog */}
      <Dialog open={noticeDialogOpen} onClose={() => setNoticeDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1e293b',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', bgcolor: '#0f172a', borderBottom: '1px solid #334155' }}>Add Notice</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={noticeForm.title}
                onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Message"
                value={noticeForm.message}
                onChange={e => setNoticeForm({ ...noticeForm, message: e.target.value })}
                InputProps={{ sx: { color: '#f1f5f9' } }}
                InputLabelProps={{ sx: { color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } } }}
                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cbd5e1', '&.Mui-focused': { color: '#ff8c00' } }}>Type</InputLabel>
                <Select
                  value={noticeForm.type}
                  onChange={e => setNoticeForm({ ...noticeForm, type: e.target.value })}
                  label="Type"
                  sx={{ color: '#f1f5f9', bgcolor: '#263449', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff8c00' } }}
                >
                  <MenuItem value="info" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Info</MenuItem>
                  <MenuItem value="success" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Success</MenuItem>
                  <MenuItem value="warning" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Warning</MenuItem>
                  <MenuItem value="error" sx={{ bgcolor: '#1e293b', color: '#f1f5f9' }}>Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid #334155', p: 2 }}>
          <Button onClick={() => setNoticeDialogOpen(false)} sx={{ color: '#cbd5e1', '&:hover': { bgcolor: '#263449' } }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNotice} sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' } }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ===== EXAM SETTINGS =====
function ExamSettings() {
  const [examDate, setExamDate] = useState('2026-02-28');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExamSettings();
  }, []);

  const fetchExamSettings = async () => {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (!snap.empty) {
        const settings = snap.docs[0].data();
        setExamDate(settings.examDate || '2026-02-28');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (snap.empty) {
        await addDoc(collection(db, 'settings'), {
          examDate,
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'settings', snap.docs[0].id), {
          examDate,
          updatedAt: serverTimestamp()
        });
      }
      alert('Exam date saved successfully!');
    } catch (error) {
      console.error('Error saving exam date:', error);
    }
    setLoading(false);
  };

  const daysUntilExam = Math.ceil(
    (new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f1f5f9' }}>
        Exam Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #334155', bgcolor: '#1e293b', maxWidth: 500 }}>
        <Typography sx={{ mb: 2, fontWeight: 600, color: '#f1f5f9' }}>
          A/L Exam Date
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={examDate}
          onChange={e => setExamDate(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#f1f5f9', borderColor: '#334155', '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#ff8c00' } } }}
          InputProps={{ sx: { color: '#f1f5f9' } }}
        />
        
        {daysUntilExam > 0 && (
          <Alert severity="info" sx={{ 
            mb: 2,
            bgcolor: '#001f5c',
            color: '#0052cc',
            '& .MuiAlert-icon': { color: '#0052cc' }
          }}>
            {daysUntilExam} days remaining until the exam
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          fullWidth
          sx={{ bgcolor: '#ff8c00', color: '#0f172a', '&:hover': { bgcolor: '#e67e00' }, '&.Mui-disabled': { bgcolor: '#475569', color: '#94a3b8' } }}
        >
          {loading ? 'Saving...' : 'Save Exam Date'}
        </Button>
      </Paper>
    </Box>
  );
}
