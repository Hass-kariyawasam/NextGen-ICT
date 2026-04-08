import React, { useMemo, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import Sidebar, { COLLAPSED_WIDTH, EXPANDED_WIDTH } from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import FloatingCart from '../components/dashboard/FloatingCart';

import DashboardHome from './dashboard/DashboardHome';
import CoursesPage from './dashboard/CoursesPage';
import MyCoursesPage from './dashboard/MyCoursesPage';
import CourseDetailPage from './dashboard/CourseDetailPage';
import CourseViewerPage from './dashboard/CourseViewerPage';
import SettingsPage from './dashboard/SettingsPage';
import CartPage from './dashboard/CartPage';
import PaymentSubmissionPage from './dashboard/PaymentSubmissionPage';
import OrderHistoryPage from './dashboard/OrderHistoryPage';
import '../styles/lms.css';

const MOBILE_NAV = [
  { label: 'Home',    icon: <DashboardRoundedIcon />,   path: '/dashboard-lms' },
  { label: 'Courses', icon: <MenuBookRoundedIcon />,     path: '/dashboard-lms/courses' },
  { label: 'My',      icon: <SchoolRoundedIcon />,       path: '/dashboard-lms/my-courses' },
  { label: 'Cart',    icon: <ShoppingCartRoundedIcon />, path: '/dashboard-lms/cart' },
  { label: 'Profile', icon: <PersonRoundedIcon />,       path: '/dashboard-lms/settings' },
];

export default function DashboardLMS() {
  // default = true  →  sidebar starts EXPANDED
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  const sidebarW = sidebarExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const navValue = useMemo(() => {
    const match = MOBILE_NAV.find(
      (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
    );
    return match?.path || '/dashboard-lms';
  }, [location.pathname]);

  return (
    <Box className="lms-shell" sx={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh' }}>

      {/* Sidebar receives expanded state from here */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(p => !p)}
      />

      {/* Main content — offset animates with sidebar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, md: `${sidebarW}px` },
          transition: 'margin-left 0.26s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          sidebarExpanded={sidebarExpanded}
          onSidebarToggle={() => setSidebarExpanded(p => !p)}
        />

        <Box sx={{
          px: { xs: 1.5, sm: 2.5, lg: 3.5 },
          py: { xs: 2, sm: 3 },
          maxWidth: 1600, mx: 'auto', width: '100%',
          pt: { xs: '80px', md: '80px' },
          pb: { xs: '90px', md: '40px' },
        }}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="courses"                element={<CoursesPage />} />
            <Route path="my-courses"             element={<MyCoursesPage />} />
            <Route path="course-detail/:courseId" element={<CourseDetailPage />} />
            <Route path="course/:courseId"       element={<CourseViewerPage />} />
            <Route path="settings"               element={<SettingsPage />} />
            <Route path="cart"                   element={<CartPage />} />
            <Route path="payment-submission"     element={<PaymentSubmissionPage />} />
            <Route path="order-history"          element={<OrderHistoryPage />} />
            <Route path="free-zone"              element={<CoursesPage filter="Free" />} />
            <Route path="resources"              element={<CoursesPage filter="Theory" />} />
            <Route path="online-class"           element={<CoursesPage filter="Web" />} />
            <Route path="practical"              element={<CoursesPage filter="Programming" />} />
          </Routes>
        </Box>
      </Box>

      <FloatingCart />

      {/* Mobile bottom nav */}
      <Box className="lms-bottom-nav" sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <BottomNavigation showLabels value={navValue} onChange={(_, v) => navigate(v)}
          sx={{ bgcolor: 'transparent', '& .MuiBottomNavigationAction-root': { minWidth: 0, py: 0.75, color: '#64748b', '&.Mui-selected': { color: '#2563eb' } } }}
        >
          {MOBILE_NAV.map((item) => (
            <BottomNavigationAction key={item.path} value={item.path} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
}
