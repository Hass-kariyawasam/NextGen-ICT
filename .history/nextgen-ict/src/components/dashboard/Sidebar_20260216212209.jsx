import React from 'react';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Divider, Avatar, Drawer, IconButton
} from '@mui/material';
import DashboardRoundedIcon    from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon     from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon       from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon       from '@mui/icons-material/FolderRounded';
import VideocamRoundedIcon     from '@mui/icons-material/VideocamRounded';
import ScienceRoundedIcon      from '@mui/icons-material/ScienceRounded';
import FreeBreakfastRoundedIcon from '@mui/icons-material/FreeBreakfastRounded';
import LogoutRoundedIcon       from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon        from '@mui/icons-material/CloseRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const NAV = [
  { label: 'Dashboard',          icon: <DashboardRoundedIcon />,     path: '/dashboard-lms' },
  { label: 'Courses',            icon: <MenuBookRoundedIcon />,       path: '/dashboard-lms/courses' },
  { label: 'My Courses',         icon: <SchoolRoundedIcon />,         path: '/dashboard-lms/my-courses' },
  { label: 'Resources Zone',     icon: <FolderRoundedIcon />,         path: '/dashboard-lms/resources' },
  { label: 'Online Class',       icon: <VideocamRoundedIcon />,       path: '/dashboard-lms/online-class' },
  { label: 'Practical Sections', icon: <ScienceRoundedIcon />,        path: '/dashboard-lms/practical' },
  { label: 'Free Zone',          icon: <FreeBreakfastRoundedIcon />,  path: '/dashboard-lms/free-zone' },
];

function SidebarContent({ onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logOut } = useAuth();

  const go = (path) => { navigate(path); onClose?.(); };

  const handleLogout = async () => {
    try { await logOut(); navigate('/'); }
    catch (e) { console.error(e); }
  };

  return (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: '#ffffff', borderRight: '1px solid #f0f0f0'
    }}>
      {/* ── Logo ── */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#2563EB', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
            N
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.1 }}>
              NextGen
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563EB', lineHeight: 1.1 }}>
              ICT
            </Typography>
          </Box>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* ── Nav ── */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {NAV.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => go(item.path)}
                sx={{
                  borderRadius: '12px', py: 1,
                  bgcolor: active ? '#EFF6FF' : 'transparent',
                  color:   active ? '#2563EB' : '#64748b',
                  '&:hover': { bgcolor: '#F8FAFC', color: '#1e293b' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? '#2563EB' : '#94a3b8' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                />
                {active && <Box sx={{ width: 4, height: 24, bgcolor: '#2563EB', borderRadius: 2 }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* ── Logout ── */}
      <Box sx={{ px: 1.5, py: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: '12px', py: 1, color: '#ef4444', '&:hover': { bgcolor: '#FEF2F2' } }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop */}
      <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <Box sx={{
          width: DRAWER_WIDTH, position: 'fixed', top: 0, bottom: 0,
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)'
        }}>
          <SidebarContent />
        </Box>
      </Box>

      {/* Mobile */}
      <Drawer
        variant="temporary" open={mobileOpen} onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}