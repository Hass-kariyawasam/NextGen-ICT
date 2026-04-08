import React, { useState } from 'react';
import {
  Avatar, Box, Chip, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, Tooltip, Typography, Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard',       icon: <DashboardRoundedIcon />,   path: '/dashboard-lms' },
  { label: 'Explore Courses', icon: <MenuBookRoundedIcon />,     path: '/dashboard-lms/courses' },
  { label: 'My Courses',      icon: <SchoolRoundedIcon />,       path: '/dashboard-lms/my-courses' },
  { label: 'Resources',       icon: <FolderRoundedIcon />,       path: '/dashboard-lms/resources' },
  { label: 'Online Classes',  icon: <VideocamRoundedIcon />,     path: '/dashboard-lms/online-class' },
  { label: 'Practical',       icon: <ScienceRoundedIcon />,      path: '/dashboard-lms/practical' },
  { label: 'Cart',            icon: <ShoppingCartRoundedIcon />, path: '/dashboard-lms/cart' },
];

export const COLLAPSED_WIDTH = 72;
export const EXPANDED_WIDTH  = 248;

const S = {
  bg:     '#0f1e36',
  active: '#000a5f',
  accent: '#ffffff',
  text:   '#cecece',
  hover:  'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.07)',
};

function isActivePath(path, pathname) {
  return path === '/dashboard-lms'
    ? pathname === path
    : pathname === path || pathname.startsWith(`${path}/`);
}

/* ── Single nav item ── */
function NavItem({ item, expanded, pathname, onClick }) {
  const active = isActivePath(item.path, pathname);

  const btn = (
    <ListItemButton onClick={onClick} sx={{
      borderRadius: '10px', mb: 0.5, minHeight: 46,
      px: expanded ? 1.5 : 0,
      justifyContent: expanded ? 'flex-start' : 'center',
      background: active ? S.active : 'transparent',
      color: active ? S.accent : S.text,
      position: 'relative',
      transition: 'background 0.15s, color 0.15s',
      '&:hover': { background: active ? S.active : S.hover, color: '#e2e8f0' },
      '&::before': active ? {
        content: '""', position: 'absolute', left: 0,
        top: '18%', bottom: '18%', width: 3,
        borderRadius: '0 3px 3px 0', background: S.accent,
      } : {},
    }}>
      <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: expanded ? 1.5 : 0, fontSize: '1.2rem' }}>
        {item.icon}
      </ListItemIcon>
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            <Typography sx={{ fontSize: '0.855rem', fontWeight: active ? 700 : 500, color: 'inherit', letterSpacing: 0.15 }}>
              {item.label}
            </Typography>
          </motion.span>
        )}
      </AnimatePresence>
    </ListItemButton>
  );

  return !expanded
    ? <Tooltip title={item.label} placement="right" arrow>{btn}</Tooltip>
    : btn;
}

/* ── Student type badge ── */
function StudentBadge({ studentType, expanded }) {
  const isOnline = studentType === 'online';
  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <Chip
            size="small"
            icon={isOnline
              ? <WifiRoundedIcon sx={{ fontSize: '0.75rem !important', color: isOnline ? '#34d399 !important' : '#fb923c !important' }} />
              : <LocationOnRoundedIcon sx={{ fontSize: '0.75rem !important', color: '#fb923c !important' }} />
            }
            label={isOnline ? 'Online Student' : 'Physical Student'}
            sx={{
              mt: 0.75,
              height: 22,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: 0.3,
              background: isOnline ? 'rgba(52,211,153,0.12)' : 'rgba(251,146,60,0.12)',
              color: isOnline ? '#34d399' : '#fb923c',
              border: `1px solid ${isOnline ? 'rgba(52,211,153,0.25)' : 'rgba(251,146,60,0.25)'}`,
              '& .MuiChip-label': { px: 0.75 },
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════
   Desktop sidebar  — default EXPANDED
══════════════════════════════════════ */
function DesktopSidebar({ expanded, onToggle }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logOut, userData } = useAuth();

  const studentType = userData?.studentType || 'online';
  const displayName = userData?.name || 'Student';

  const handleLogout = async () => { await logOut(); navigate('/'); };

  return (
    <Box
      component={motion.div}
      animate={{ width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 1300, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', background: S.bg,
        borderRight: `1px solid ${S.border}`,
        boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
        overflow: 'hidden', flexShrink: 0,
      }}
    >
      {/* ── Brand / Logo area ── */}
      <Box sx={{
        display: 'flex', alignItems: 'flex-start',
        px: expanded ? 1.75 : 0,
        pt: 2.25, pb: 1.75,
        minHeight: 76,
        borderBottom: `1px solid ${S.border}`,
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: '100%', justifyContent: expanded ? 'flex-start' : 'center' }}>
          {/* Logo avatar */}
          <Avatar sx={{
            width: 38, height: 38, flexShrink: 0,
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            fontWeight: 900, fontSize: '1.05rem',
            border: '2px solid rgba(59,130,246,0.3)',
            boxShadow: '0 0 12px rgba(59,130,246,0.3)',
          }}>N</Avatar>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.16 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '0.98rem', color: '#f1f5f9', lineHeight: 1.1, letterSpacing: -0.3 }}>
                  NextGen ICT
                </Typography>
                {/* Student type badge — only when expanded */}
                {expanded && (
                  <Box sx={{ pl: expanded ? '0px' : 0 }}>
                    <StudentBadge studentType={studentType} expanded={expanded} />
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>


      </Box>

      {/* ── Nav list ── */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <NavItem
              item={item}
              expanded={expanded}
              pathname={location.pathname}
              onClick={() => navigate(item.path)}
            />
          </ListItem>
        ))}
      </List>

      {/* ── Bottom: Settings + Logout ── */}
      <Box sx={{ px: 1, pb: 2, borderTop: `1px solid ${S.border}`, pt: 1.25 }}>
        <NavItem
          item={{ label: 'Settings', icon: <SettingsRoundedIcon />, path: '/dashboard-lms/settings' }}
          expanded={expanded}
          pathname={location.pathname}
          onClick={() => navigate('/dashboard-lms/settings')}
        />

        {!expanded ? (
          <Tooltip title="Logout" placement="right" arrow>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', minHeight: 46, justifyContent: 'center', color: '#f87171', '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#fca5a5' } }}>
              <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}><LogoutRoundedIcon /></ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', minHeight: 46, px: 1.5, color: '#f87171', '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#fca5a5' } }}>
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: 1.5 }}><LogoutRoundedIcon /></ListItemIcon>
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Typography sx={{ fontSize: '0.855rem', fontWeight: 700, color: 'inherit' }}>Logout</Typography>
                </motion.span>
              )}
            </AnimatePresence>
          </ListItemButton>
        )}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════
   Mobile Drawer
══════════════════════════════ */
function MobileDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut, userData } = useAuth();
  const studentType = userData?.studentType || 'online';
  const handleLogout = async () => { await logOut(); navigate('/'); };
  const go = (path) => { navigate(path); onClose(); };
  const isOnline = studentType === 'online';

  return (
    <Drawer open={open} onClose={onClose} ModalProps={{ keepMounted: true }}
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: EXPANDED_WIDTH, background: S.bg, border: 'none', boxShadow: '8px 0 32px rgba(0,0,0,0.4)' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', px: 1.75, pt: 2.25, pb: 1.75, minHeight: 76, borderBottom: `1px solid ${S.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', fontWeight: 900, fontSize: '1.05rem', border: '2px solid rgba(59,130,246,0.3)' }}>N</Avatar>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '0.98rem', color: '#f1f5f9', lineHeight: 1.1 }}>NextGen ICT</Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#475569', letterSpacing: 1.4 }}>STUDENT PORTAL</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#475569', '&:hover': { color: '#e2e8f0' } }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ pl: '50px', mt: 0.75 }}>
          <Chip size="small"
            icon={isOnline ? <WifiRoundedIcon sx={{ fontSize: '0.75rem !important', color: '#34d399 !important' }} /> : <LocationOnRoundedIcon sx={{ fontSize: '0.75rem !important', color: '#fb923c !important' }} />}
            label={isOnline ? 'Online Student' : 'Physical Student'}
            sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, letterSpacing: 0.3, background: isOnline ? 'rgba(52,211,153,0.12)' : 'rgba(251,146,60,0.12)', color: isOnline ? '#34d399' : '#fb923c', border: `1px solid ${isOnline ? 'rgba(52,211,153,0.25)' : 'rgba(251,146,60,0.25)'}`, '& .MuiChip-label': { px: 0.75 }, '& .MuiChip-icon': { ml: 0.5 } }}
          />
        </Box>
      </Box>

      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {NAV.map((item) => {
          const active = isActivePath(item.path, location.pathname);
          return (
            <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton onClick={() => go(item.path)} sx={{ borderRadius: '10px', minHeight: 48, px: 1.5, background: active ? S.active : 'transparent', color: active ? S.accent : S.text, position: 'relative', '&:hover': { background: S.hover, color: '#e2e8f0' }, '&::before': active ? { content: '""', position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: S.accent } : {} }}>
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: 1.5 }}>{item.icon}</ListItemIcon>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: 'inherit' }}>{item.label}</Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: S.border }} />
      <Box sx={{ px: 1, py: 1.5 }}>
        <ListItemButton onClick={() => go('/dashboard-lms/settings')} sx={{ borderRadius: '10px', minHeight: 48, px: 1.5, mb: 0.5, color: isActivePath('/dashboard-lms/settings', location.pathname) ? S.accent : S.text, background: isActivePath('/dashboard-lms/settings', location.pathname) ? S.active : 'transparent', '&:hover': { background: S.hover, color: '#e2e8f0' } }}>
          <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: 1.5 }}><SettingsRoundedIcon /></ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'inherit' }}>Settings</Typography>
        </ListItemButton>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', minHeight: 48, px: 1.5, color: '#f87171', '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#fca5a5' } }}>
          <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: 1.5 }}><LogoutRoundedIcon /></ListItemIcon>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'inherit' }}>Logout</Typography>
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

/* ══════════════════════════════
   Export — state lifted to parent
══════════════════════════════ */
export default function Sidebar({ mobileOpen, onClose, expanded, onToggle }) {
  return (
    <>
      <DesktopSidebar expanded={expanded} onToggle={onToggle} />
      <MobileDrawer open={mobileOpen} onClose={onClose} />
    </>
  );
}
