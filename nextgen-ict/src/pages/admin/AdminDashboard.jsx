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
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manage courses, students, and enrollments
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 56, height: 56 }}>
                  <StudentsIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Total Students
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {stats.totalStudents}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#F0FDF4', color: '#15803D', width: 56, height: 56 }}>
                  <CoursesIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Total Courses
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {stats.totalCourses}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#FFF7ED', color: '#C2410C', width: 56, height: 56 }}>
                  <EnrollmentsIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Pending Approvals
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {stats.pendingEnrollments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#F0FDF4', color: '#15803D', width: 56, height: 56 }}>
                  <DashboardIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: '1px solid #e2e8f0', px: 2 }}
        >
          <Tab label="Courses Management" icon={<CoursesIcon />} iconPosition="start" />
          <Tab label="Enrollments" icon={<EnrollmentsIcon />} iconPosition="start" />
          <Tab label="Students" icon={<StudentsIcon />} iconPosition="start" />
          <Tab label="Schedule & Notices" icon={<ScheduleIcon />} iconPosition="start" />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && <CoursesManagement onUpdate={fetchStats} />}
          {activeTab === 1 && <EnrollmentsManagement onUpdate={fetchStats} />}
          {activeTab === 2 && <StudentsManagement />}
          {activeTab === 3 && <ScheduleNoticesManagement />}
          {activeTab === 4 && <ExamSettings />}
        </Box>
      </Paper>
    </Box>
  );
}

// ===== COURSES MANAGEMENT COMPONENT =====
function CoursesManagement({ onUpdate }) {
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
    youtubePlaylistId: '',
    pdfDriveLink: '',
    notesDriveLink: ''
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

  const handleSave = async () => {
    try {
      if (editCourse) {
        await updateDoc(doc(db, 'courses', editCourse.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'courses'), {
          ...formData,
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
      youtubePlaylistId: course.youtubePlaylistId || '',
      pdfDriveLink: course.pdfDriveLink || '',
      notesDriveLink: course.notesDriveLink || ''
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
      youtubePlaylistId: '',
      pdfDriveLink: '',
      notesDriveLink: ''
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
          sx={{ borderRadius: '10px', textTransform: 'none' }}
        >
          Add New Course
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Teacher</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Students</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={course.thumbnail} variant="rounded" />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {course.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {course.totalLessons} lessons • {course.duration}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={course.category} size="small" />
                </TableCell>
                <TableCell>{course.teacher}</TableCell>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      Rs. {course.price?.toLocaleString()}
                    </Typography>
                    {course.originalPrice > course.price && (
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'line-through' }}>
                        Rs. {course.originalPrice?.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{course.students || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(course)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Short Title"
                value={formData.shortTitle}
                onChange={e => setFormData({ ...formData, shortTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="Theory">Theory</MenuItem>
                  <MenuItem value="Programming">Programming</MenuItem>
                  <MenuItem value="Web">Web Development</MenuItem>
                  <MenuItem value="Database">Database</MenuItem>
                  <MenuItem value="Networking">Networking</MenuItem>
                  <MenuItem value="Free">Free</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teacher Name"
                value={formData.teacher}
                onChange={e => setFormData({ ...formData, teacher: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (e.g., 48 hours)"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Price (Rs.)"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Original Price (Rs.)"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Lessons"
                value={formData.totalLessons}
                onChange={e => setFormData({ ...formData, totalLessons: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                value={formData.thumbnail}
                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="YouTube Playlist ID"
                value={formData.youtubePlaylistId}
                onChange={e => setFormData({ ...formData, youtubePlaylistId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PDF Drive Link"
                value={formData.pdfDriveLink}
                onChange={e => setFormData({ ...formData, pdfDriveLink: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notes Drive Link"
                value={formData.notesDriveLink}
                onChange={e => setFormData({ ...formData, notesDriveLink: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editCourse ? 'Update' : 'Create'}
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

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Enrollments ({enrollments.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Payment Slip</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map(enrollment => (
              <TableRow key={enrollment.id}>
                <TableCell>{enrollment.courseTitle}</TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {enrollment.userId?.slice(0, 12)}...
                  </Typography>
                </TableCell>
                <TableCell>Rs. {enrollment.price?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={enrollment.status}
                    color={
                      enrollment.status === 'approved' ? 'success' :
                      enrollment.status === 'pending' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {enrollment.slipLink ? (
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      href={enrollment.slipLink}
                      target="_blank"
                    >
                      View
                    </Button>
                  ) : (
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                      No slip
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {enrollment.status === 'pending' && (
                    <>
                      <IconButton onClick={() => handleApprove(enrollment.id)} color="success" size="small">
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleReject(enrollment.id)} color="error" size="small">
                        <RejectIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                  <IconButton onClick={() => handleRemove(enrollment.id)} color="error" size="small">
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

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Students ({students.length})
        </Typography>
        <TextField
          size="small"
          placeholder="Search students..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Center</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentId || 'N/A'}</TableCell>
                <TableCell>{student.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={student.center || 'online'}
                    size="small"
                    color={student.center === 'physical' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Student Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedStudent.name || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedStudent.email || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={selectedStudent.studentId || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, studentId: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="WhatsApp Number"
                  value={selectedStudent.phone || ''}
                  onChange={e => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Class Type</InputLabel>
                  <Select
                    value={selectedStudent.center || 'online'}
                    onChange={e => setSelectedStudent({ ...selectedStudent, center: e.target.value })}
                    label="Class Type"
                  >
                    <MenuItem value="physical">Physical (Galle)</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStudent}>Save</Button>
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
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Upcoming Schedule
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add
            </Button>
          </Box>
          <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {schedules.map(schedule => (
              <Box key={schedule.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{schedule.title}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {schedule.date} • {schedule.time}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDeleteSchedule(schedule.id)} size="small" color="error">
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
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notices
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNoticeDialogOpen(true)}
            >
              Add
            </Button>
          </Box>
          <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {notices.map(notice => (
              <Alert
                key={notice.id}
                severity={notice.type}
                sx={{ mb: 2 }}
                action={
                  <IconButton onClick={() => handleDeleteNotice(notice.id)} size="small">
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={scheduleForm.title}
                onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={scheduleForm.type}
                  onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="live">Live Class</MenuItem>
                  <MenuItem value="practical">Practical</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                value={scheduleForm.course}
                onChange={e => setScheduleForm({ ...scheduleForm, course: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSchedule}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Notice Dialog */}
      <Dialog open={noticeDialogOpen} onClose={() => setNoticeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Notice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={noticeForm.title}
                onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
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
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={noticeForm.type}
                  onChange={e => setNoticeForm({ ...noticeForm, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoticeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNotice}>Save</Button>
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Exam Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: 500 }}>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          A/L Exam Date
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={examDate}
          onChange={e => setExamDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {daysUntilExam > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {daysUntilExam} days remaining until the exam
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving...' : 'Save Exam Date'}
        </Button>
      </Paper>
    </Box>
  );
}
