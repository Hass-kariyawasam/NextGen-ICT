import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatRemainingDays } from '../../utils/courseHelpers';

const PAGE_TITLES = {
  '/dashboard-lms': 'Dashboard',
  '/dashboard-lms/courses': 'Courses',
  '/dashboard-lms/my-courses': 'My Courses',
  '/dashboard-lms/cart': 'Cart',
  '/dashboard-lms/settings': 'Settings',
  '/dashboard-lms/resources': 'Resources',
  '/dashboard-lms/online-class': 'Online Classes',
  '/dashboard-lms/practical': 'Practical Classes'
};

export default function TopBar({ onMenuClick }) {
  const { user, userData, logOut } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [examDate, setExamDate] = useState('2026-08-10');
  const [daysLeft, setDaysLeft] = useState(formatRemainingDays('2026-08-10'));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snapshot) => {
      if (!snapshot.empty) {
        const settings = snapshot.docs[0].data();
        if (settings.examDate) {
          setExamDate(settings.examDate);
          setDaysLeft(formatRemainingDays(settings.examDate));
        }
      }
    });

    const timer = setInterval(() => setDaysLeft(formatRemainingDays(examDate)), 60000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [examDate]);

  const pageTitle = useMemo(() => {
    const direct = PAGE_TITLES[location.pathname];
    if (direct) return direct;
    if (location.pathname.includes('/course/')) return 'Course Viewer';
    return 'Dashboard';
  }, [location.pathname]);

  const displayName = userData?.name || user?.displayName || 'Student';
  const subText = userData?.studentId || userData?.email || user?.email || 'NextGen ICT';

  const handleLogout = async () => {
    setAnchorEl(null);
    await logOut();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        px: { xs: 0, sm: 0 },
        py: { xs: 0, sm: 0 },
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        ml: { md: '96px' }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Toolbar 
          sx={{ 
            px: { xs: 1.5, sm: 2.5, lg: 3.5 }, 
            minHeight: '64px !important', 
            gap: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' }, color: 'var(--lms-text)' }}>
              <MenuRoundedIcon />
            </IconButton>
          </motion.div>

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: -0.5 }}>{pageTitle}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.25 }}>{displayName}</Typography>
          </Box>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
            <Chip
              icon={<CalendarMonthRoundedIcon sx={{ color: '#0052cc !important', fontSize: '1.1rem' }} />}
              label={daysLeft >= 0 ? `${daysLeft} days` : 'Completed'}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                background: '#f0f4ff',
                color: '#0052cc',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderRadius: '6px',
                height: 36,
                border: '1px solid #e0e7ff',
                '&:hover': { background: '#e6ecff' }
              }}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton 
              onClick={() => navigate('/dashboard-lms/cart')} 
              sx={{ color: '#0f172a', '&:hover': { bgcolor: '#f8f9fa' } }}
            >
              <Badge badgeContent={cart.length} color="primary" sx={{ '& .MuiBadge-badge': { background: '#0052cc', color: '#fff', fontSize: '0.7rem' } }}>
                <ShoppingCartRoundedIcon />
              </Badge>
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  background: '#0052cc',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#fff',
                  cursor: 'pointer',
                  border: '2px solid #e5e7eb'
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </motion.div>

          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  mt: 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{displayName}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{subText}</Typography>
            </Box>
            <MenuItem 
              onClick={() => { setAnchorEl(null); navigate('/dashboard-lms/settings'); }}
              sx={{ color: '#0f172a', '&:hover': { bgcolor: '#f8f9fa' } }}
            >
              <SettingsRoundedIcon sx={{ mr: 1.25, fontSize: '1rem', color: '#0052cc' }} /> Settings
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}
            >
              <LogoutRoundedIcon sx={{ mr: 1.25, fontSize: '1rem' }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </motion.div>
    </AppBar>
  );
}
