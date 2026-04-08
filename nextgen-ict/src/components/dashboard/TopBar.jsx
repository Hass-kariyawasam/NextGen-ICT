import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar, Avatar, Badge, Box, Chip, Divider,
  IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatRemainingDays } from '../../utils/courseHelpers';
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from './Sidebar';

const PAGE_MAP = {
  '/dashboard-lms':              { title: 'Dashboard',         crumb: 'Dashboard' },
  '/dashboard-lms/courses':       { title: 'Explore Courses',   crumb: 'Explore Courses' },
  '/dashboard-lms/my-courses':    { title: 'My Courses',        crumb: 'My Courses' },
  '/dashboard-lms/cart':          { title: 'Cart',              crumb: 'Cart' },
  '/dashboard-lms/settings':      { title: 'Settings',          crumb: 'Settings' },
  '/dashboard-lms/resources':     { title: 'Resources',         crumb: 'Resources' },
  '/dashboard-lms/online-class':  { title: 'Online Classes',    crumb: 'Online Classes' },
  '/dashboard-lms/practical':     { title: 'Practical Classes', crumb: 'Practical Classes' },
  '/dashboard-lms/order-history': { title: 'Order History',     crumb: 'Order History' },
};

export default function TopBar({ onMenuClick, sidebarExpanded, onSidebarToggle }) {
  const { user, userData, logOut } = useAuth();
  const { cart }    = useCart();
  const navigate    = useNavigate();
  const location    = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [examDate, setExamDate] = useState('2026-08-10');
  const [daysLeft, setDaysLeft] = useState(formatRemainingDays('2026-08-10'));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snap) => {
      if (!snap.empty) {
        const s = snap.docs[0].data();
        if (s.examDate) { setExamDate(s.examDate); setDaysLeft(formatRemainingDays(s.examDate)); }
      }
    });
    const timer = setInterval(() => setDaysLeft(formatRemainingDays(examDate)), 60000);
    return () => { unsub(); clearInterval(timer); };
  }, [examDate]);

  const pageInfo = useMemo(() => {
    const direct = PAGE_MAP[location.pathname];
    if (direct) return direct;
    if (location.pathname.includes('/course/'))        return { title: 'Course Viewer', crumb: 'Course Viewer' };
    if (location.pathname.includes('/course-detail/')) return { title: 'Course Detail', crumb: 'Course Detail' };
    return { title: 'Dashboard', crumb: 'Dashboard' };
  }, [location.pathname]);

  const displayName = userData?.name || user?.displayName || 'Student';
  const subText     = userData?.studentId || user?.email || 'NextGen ICT';
  const isExamClose = typeof daysLeft === 'number' && daysLeft <= 30 && daysLeft >= 0;
  const examLabel   = typeof daysLeft === 'number'
    ? (daysLeft >= 0 ? `${daysLeft} days left` : 'Exam complete')
    : 'Exam countdown';

  const handleLogout = async () => { setAnchorEl(null); await logOut(); navigate('/'); };

  /* sidebar offset — animate with sidebar */
  const sidebarW = sidebarExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <AppBar
      component={motion.div}
      animate={{ marginLeft: sidebarW, width: `calc(100% - ${sidebarW}px)` }}
      transition={{ duration: 0.01, ease: [0.4, 0, 0.2, 1] }}
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 0 #e5e7eb',
        top: 0, left: 0, right: 0, zIndex: 1200,
        display: { xs: 'block', md: 'block' },
        /* mobile: full width */
        '@media (max-width: 899px)': { ml: '0 !important', width: '100% !important' },
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, sm: 2, lg: 2.5 }, minHeight: '64px !important', gap: 1, display: 'flex', alignItems: 'center' }}>

        {/* ── Desktop: sidebar toggle button ── */}
        <Tooltip title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'} placement="bottom">
          <motion.div whileTap={{ scale: 0.88 }} style={{ display: 'flex' }}>
            <IconButton
              onClick={onSidebarToggle}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: '#374151',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                width: 36, height: 36,
                '&:hover': { bgcolor: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' },
                transition: 'all 0.01s',
              }}
            >
              {sidebarExpanded
                ? <MenuOpenRoundedIcon sx={{ fontSize: '1.15rem' }} />
                : <MenuRoundedIcon    sx={{ fontSize: '1.15rem' }} />
              }
            </IconButton>
          </motion.div>
        </Tooltip>

        {/* ── Mobile: hamburger ── */}
        <motion.div whileTap={{ scale: 0.9 }} style={{ display: 'flex' }}>
          <IconButton onClick={onMenuClick} sx={{ display: { xs: 'flex', md: 'none' }, color: '#374151', '&:hover': { bgcolor: '#f3f4f6' } }}>
            <MenuRoundedIcon />
          </IconButton>
        </motion.div>

      

        {/* ── Page title + breadcrumb ── */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, fontWeight: 800, color: '#0f172a', letterSpacing: -0.4, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {pageInfo.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <HomeRoundedIcon sx={{ fontSize: '0.68rem', color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>Home</Typography>
            <NavigateNextRoundedIcon sx={{ fontSize: '0.68rem', color: '#cbd5e1' }} />
            <Typography sx={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 700 }}>{pageInfo.crumb}</Typography>
          </Box>
        </Box>

        {/* ── Exam countdown ── */}
        <motion.div whileHover={{ scale: 1.04 }}>
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ fontSize: '0.9rem !important', color: `${isExamClose ? '#dc2626' : '#2563eb'} !important` }} />}
            label={examLabel}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              background: isExamClose ? '#fef2f2' : '#eff6ff',
              color: isExamClose ? '#dc2626' : '#2563eb',
              fontWeight: 700, fontSize: '0.76rem',
              borderRadius: '8px', height: 32,
              border: `1px solid ${isExamClose ? '#fecaca' : '#bfdbfe'}`,
              '& .MuiChip-label': { px: 0.875 },
            }}
          />
        </motion.div>

        {/* ── Notification bell ── */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton sx={{ color: '#374151', '&:hover': { bgcolor: '#f3f4f6', color: '#2563eb' } }}>
            <Badge badgeContent={0} color="error">
              <NotificationsRoundedIcon sx={{ fontSize: '1.2rem' }} />
            </Badge>
          </IconButton>
        </motion.div>

        {/* ── Cart ── */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton onClick={() => navigate('/dashboard-lms/cart')} sx={{ color: '#374151', '&:hover': { bgcolor: '#f3f4f6', color: '#2563eb' } }}>
            <Badge badgeContent={cart.length} color="primary" sx={{ '& .MuiBadge-badge': { background: '#2563eb', color: '#fff', fontSize: '0.62rem', minWidth: 15, height: 15 } }}>
              <ShoppingCartRoundedIcon sx={{ fontSize: '1.2rem' }} />
            </Badge>
          </IconButton>
        </motion.div>

        {/* ── Profile card ── */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.875,
              cursor: 'pointer', pl: 0.75, pr: 1, py: 0.5,
              borderRadius: '10px', border: '1px solid #e5e7eb',
              transition: 'all 0.01s',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#bfdbfe' },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.15, whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subText}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Profile dropdown ── */}
        <Menu
          anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 210, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'visible',
            '&::before': { content: '""', display: 'block', position: 'absolute', top: -6, right: 18, width: 11, height: 11, background: '#fff', border: '1px solid #e5e7eb', borderRight: 'none', borderBottom: 'none', transform: 'rotate(45deg)' }
          }}}}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', fontWeight: 800, fontSize: '0.95rem' }}>
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{displayName}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{subText}</Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ borderColor: '#f1f5f9' }} />
          <Box sx={{ p: 0.75 }}>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard-lms/settings'); }} sx={{ borderRadius: '8px', gap: 1.25, color: '#374151', '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' } }}>
              <AccountCircleRoundedIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 600 }}>View Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard-lms/settings'); }} sx={{ borderRadius: '8px', gap: 1.25, color: '#374151', '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' } }}>
              <SettingsRoundedIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 600 }}>Settings</Typography>
            </MenuItem>
            <Divider sx={{ borderColor: '#f1f5f9', my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', gap: 1.25, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
              <LogoutRoundedIcon sx={{ fontSize: '1rem' }} />
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700 }}>Logout</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
