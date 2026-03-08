import React from 'react';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Drawer, IconButton
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import FreeBreakfastRoundedIcon from '@mui/icons-material/FreeBreakfastRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard-lms' },
  { label: 'Courses', icon: <MenuBookRoundedIcon />, path: '/dashboard-lms/courses' },
  { label: 'My Courses', icon: <SchoolRoundedIcon />, path: '/dashboard-lms/my-courses' },
  { label: 'Resources Zone', icon: <FolderRoundedIcon />, path: '/dashboard-lms/resources' },
  { label: 'Online Class', icon: <VideocamRoundedIcon />, path: '/dashboard-lms/online-class' },
  { label: 'Practical Sections', icon: <ScienceRoundedIcon />, path: '/dashboard-lms/practical' },
  { label: 'Free Zone', icon: <FreeBreakfastRoundedIcon />, path: '/dashboard-lms/free-zone' },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: '#ffffff', borderRight: '1px solid #f0f0f0'
    }}>
      {/* Logo */}
      <Box sx={{
        px: 3, py: 3, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            bgcolor: '#2563EB', width: 36, height: 36,
            fontSize: '0.85rem', fontWeight: 700
          }}>N</Avatar>
          <Typography sx={{
            fontWeight: 800, fontSize: '1rem', color: '#1e293b',
            letterSpacing: '-0.3px', lineHeight: 1.2
          }}>
            NextGen<br />
            <span style={{ color: '#2563EB' }}>ICT</span>
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Nav Items */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: '12px',
                  py: 1,
                  bgcolor: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? '#2563EB' : '#64748b',
                  '&:hover': { bgcolor: '#F8FAFC', color: '#1e293b' },
                  transition: 'all 0.15s ease',
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: isActive ? '#2563EB' : '#94a3b8'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400
                  }}
                />
                {isActive && (
                  <Box sx={{
                    width: 4, height: 24, bgcolor: '#2563EB',
                    borderRadius: 2, ml: 1
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Logout */}
      <Box sx={{ px: 1.5, py: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px', py: 1, color: '#ef4444',
            '&:hover': { bgcolor: '#FEF2F2' }
          }}
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
      <Box sx={{
        width: DRAWER_WIDTH, flexShrink: 0,
        display: { xs: 'none', md: 'block' }
      }}>
        <Box sx={{
          width: DRAWER_WIDTH, position: 'fixed', top: 0, bottom: 0,
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)'
        }}>
          <SidebarContent />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' }
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}