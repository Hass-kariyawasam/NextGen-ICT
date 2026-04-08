import React, { useMemo, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Sidebar from '../components/dashboard/Sidebar';
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

const DRAWER_WIDTH = 96;

const MOBILE_NAV = [
  { label: 'Home', icon: <DashboardRoundedIcon />, path: '/dashboard-lms' },
  { label: 'Courses', icon: <MenuBookRoundedIcon />, path: '/dashboard-lms/courses' },
  { label: 'My', icon: <SchoolRoundedIcon />, path: '/dashboard-lms/my-courses' },
  { label: 'Cart', icon: <ShoppingCartRoundedIcon />, path: '/dashboard-lms/cart' },
  { label: 'Profile', icon: <PersonRoundedIcon />, path: '/dashboard-lms/settings' }
];

export default function DashboardLMS() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navValue = useMemo(() => {
    const match = MOBILE_NAV.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));
    return match?.path || '/dashboard-lms';
  }, [location.pathname]);

  return (
    <Box className="lms-shell" sx={{ display: 'flex', background: '#f8f9fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} drawerWidth={DRAWER_WIDTH} />

      <Box sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, minWidth: 0 }}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <Box sx={{ px: { xs: 1.5, sm: 2.5, lg: 3.5 }, py: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto', pt: { xs: '80px', sm: '80px', md: '80px' }, pb: { xs: '80px', md: '40px' } }}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="my-courses" element={<MyCoursesPage />} />
            <Route path="course-detail/:courseId" element={<CourseDetailPage />} />
            <Route path="course/:courseId" element={<CourseViewerPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="payment-submission" element={<PaymentSubmissionPage />} />
            <Route path="order-history" element={<OrderHistoryPage />} />
            <Route path="free-zone" element={<CoursesPage filter="Free" />} />
            <Route path="resources" element={<CoursesPage filter="Theory" />} />
            <Route path="online-class" element={<CoursesPage filter="Web" />} />
            <Route path="practical" element={<CoursesPage filter="Programming" />} />
          </Routes>
        </Box>
      </Box>

      <FloatingCart />

      <Box className="lms-bottom-nav" sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, bgcolor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(_, newValue) => navigate(newValue)}
          sx={{ bgcolor: 'transparent', '& .MuiBottomNavigationAction-root': { minWidth: 0, py: 0.75, color: '#64748b', '&.Mui-selected': { color: '#0052cc' } } }}
        >
          {MOBILE_NAV.map((item) => (
            <BottomNavigationAction
              key={item.path}
              value={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
}
