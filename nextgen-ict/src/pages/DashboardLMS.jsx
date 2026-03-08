import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar          from '../components/dashboard/Sidebar';
import TopBar           from '../components/dashboard/TopBar';
import DashboardHome    from './dashboard/DashboardHome';
import CoursesPage      from './dashboard/CoursesPage';
import MyCoursesPage    from './dashboard/MyCoursesPage';
import CourseViewerPage from './dashboard/CourseViewerPage';
import SettingsPage     from './dashboard/SettingsPage';
import CartPage         from './dashboard/CartPage';
import { CartProvider } from '../context/CartContext';

const DRAWER_WIDTH = 240;

export default function DashboardLMS() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CartProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box sx={{
          flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` },
          display: 'flex', flexDirection: 'column'
        }}>
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
            <Routes>
              <Route index                   element={<DashboardHome />} />
              <Route path="courses"          element={<CoursesPage />} />
              <Route path="my-courses"       element={<MyCoursesPage />} />
              <Route path="course/:courseId" element={<CourseViewerPage />} />
              <Route path="settings"         element={<SettingsPage />} />
              <Route path="cart"             element={<CartPage />} />
              <Route path="free-zone"        element={<CoursesPage filter="Free" />} />
              <Route path="resources"        element={<CoursesPage filter="Theory" />} />
              <Route path="online-class"     element={<CoursesPage filter="Web" />} />
              <Route path="practical"        element={<CoursesPage filter="Programming" />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </CartProvider>
  );
}